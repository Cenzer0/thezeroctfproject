import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import type { DockerAdapter } from './docker.adapter';
import { Inject } from '@nestjs/common';

export type InstanceJob =
  | { type: 'spawn'; payload: { instanceId: string } }
  | { type: 'stop'; payload: { instanceId: string } }
  | { type: 'reset'; payload: { instanceId: string } };

@Processor('instance')
export class InstanceWorker extends WorkerHost {
  constructor(private prisma: PrismaService, @Inject('DockerAdapter') private docker: DockerAdapter) {
    super();
  }

  async process(job: Job<InstanceJob>): Promise<any> {
    switch (job.data.type) {
      case 'spawn':
        return this.spawn(job.data.payload.instanceId);
      case 'stop':
        return this.stop(job.data.payload.instanceId);
      case 'reset':
        await this.stop(job.data.payload.instanceId);
        return this.spawn(job.data.payload.instanceId);
    }
  }

  private async spawn(instanceId: string) {
    const inst = await this.prisma.instance.findUnique({
      where: { id: instanceId },
      include: { challenge: true, user: true },
    });
    if (!inst) return;
    const meta = (inst.challenge.metadata as any) || {};
    const image = meta.image as string;
    const internalPort = meta.exposedPort as number;
    const network = meta.network as string | undefined;
    const name = `ctf-${inst.challengeId}-${inst.userId}`;

    const { ports } = await this.docker.run({
      name,
      image,
      ports: [{ internal: internalPort }],
      network,
    });
    const external = ports[0]?.external;
    await this.prisma.instance.update({
      where: { id: instanceId },
      data: {
        status: 'running',
        host: 'localhost',
        port: external,
        ttlAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }

  private async stop(instanceId: string) {
    const inst = await this.prisma.instance.findUnique({ where: { id: instanceId } });
    if (!inst) return;
    const name = `ctf-${inst.challengeId}-${inst.userId}`;
    await this.docker.stop(name);
    await this.docker.remove(name);
    await this.prisma.instance.update({ where: { id: instanceId }, data: { status: 'stopped', host: null, port: null, ttlAt: null } });
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    // noop
  }
}
