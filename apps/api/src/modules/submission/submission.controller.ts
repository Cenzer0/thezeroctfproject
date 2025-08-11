import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubmissionService } from './submission.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@ApiTags('submission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('submission')
export class SubmissionController {
  constructor(private service: SubmissionService) {}

  @Post()
  async submit(@Body() body: { challengeId: string; flag: string }, @Req() req: any) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '';
    const ua = req.headers['user-agent'] as string | undefined;
    return this.service.submit((req.user as any).sub, body, { ip, ua });
  }

  @Post('hint')
  async claimHint(@Body() body: { hintId: string }, @Req() req: any) {
    return this.service.claimHint((req.user as any).sub, body.hintId);
  }
}
