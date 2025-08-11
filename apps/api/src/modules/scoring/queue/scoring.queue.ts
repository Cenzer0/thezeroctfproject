import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

export type ScoringJob =
  | { type: 'decay'; payload: { factor: number } }
  | { type: 'snapshot'; payload: {} };

@Processor('scoring')
export class ScoringWorker extends WorkerHost {
  constructor(private prisma: PrismaService) { super(); }

  async process(job: Job<ScoringJob>) {
    if (job.data.type === 'decay') {
      // Example decay: reduce points by factor for events older than 24h
      const factor = job.data.payload.factor;
      // Implement as needed. Placeholder noop
      return { ok: true, factor };
    }
    if (job.data.type === 'snapshot') {
      // Aggregate scores and store snapshot (could write to a table)
      return { ok: true };
    }
  }
}
