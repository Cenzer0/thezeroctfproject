import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { InstanceWorker } from './queue/instance.queue';
import { PrismaModule } from '../prisma/prisma.module';
import { InstanceController } from './instance.controller';
import { LocalDockerAdapter } from './queue/docker.adapter';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'instance' }),
  ],
  controllers: [InstanceController],
  providers: [
    InstanceWorker,
    { provide: 'DockerAdapter', useClass: LocalDockerAdapter },
  ],
  exports: [],
})
export class InstanceModule {}
