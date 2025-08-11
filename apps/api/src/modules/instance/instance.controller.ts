import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { InstanceJob } from './queue/instance.queue';

@ApiTags('instance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('instance')
export class InstanceController {
  constructor(@InjectQueue('instance') private queue: Queue<InstanceJob>) {}

  @Post('spawn')
  async spawn(@Body() body: { instanceId?: string; challengeId: string; userId?: string }) {
    // In a real app, instance would be created first; here enqueue spawn by instanceId if provided
    const payload = body.instanceId ? { instanceId: body.instanceId } : { instanceId: body.challengeId };
    await this.queue.add('spawn', { type: 'spawn', payload });
    return { enqueued: true };
  }
}
