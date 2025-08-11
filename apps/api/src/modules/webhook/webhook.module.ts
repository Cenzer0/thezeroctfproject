import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';
import { WebhookWorker } from './queue/webhook.queue';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'webhook' }),
  ],
  providers: [WebhookWorker],
})
export class WebhookModule {}
