import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChallengeService } from './challenge.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { enqueueDiscordEmbed } from '../webhook/queue/webhook.queue';

class CreateChallengeDto {
  // Will be validated in service via zod
  title!: string;
  slug!: string;
  description!: string;
  points?: number;
  flagRegex!: string;
  tags?: string[];
  kind?: 'CHALLENGE' | 'MACHINE';
  metadata?: any;
}

class UploadQueryDto {
  filename!: string;
  contentType!: string;
}

@ApiTags('challenges')
@Controller('challenges')
export class ChallengeController {
  constructor(private service: ChallengeService, @InjectQueue('webhook') private webhookQueue: Queue) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @Get(':slug')
  async bySlug(@Param('slug') slug: string) {
    return this.service.getBySlug(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateChallengeDto) {
    return this.service.create(dto as any);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    const ch = await this.service['prisma'].challenge.update({ where: { id }, data: { isPublished: true } });
    // Discord embed webhook
    await enqueueDiscordEmbed(this.service['prisma'], (n, d) => this.webhookQueue.add(n, d), {
      title: `New ${ch.kind === 'MACHINE' ? 'Machine' : 'Challenge'}: ${ch.title}`,
      description: ch.description?.slice(0, 200),
      url: `${process.env.PUBLIC_WEB_BASE || 'https://ctf.example.com'}/challenges/${ch.slug}`,
      color: 5814783,
    }, 'challenge.published');
    return { ok: true };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/retire')
  async retire(@Param('id') id: string, @Body() body: { writeupUrl?: string }) {
    return this.service.retireAndArchive(id, body.writeupUrl);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/presign')
  async presign(@Param('id') id: string, @Query() query: UploadQueryDto) {
    return this.service.getPresignedUploadUrl(id, query.filename, query.contentType);
  }
}
