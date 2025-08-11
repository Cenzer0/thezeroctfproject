import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';
import { ScoringWorker } from './queue/scoring.queue';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'scoring' }),
  ],
  providers: [ScoringWorker],
})
export class ScoringModule {}
