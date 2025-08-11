import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppBullModule } from './bull.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InstanceModule } from './instance/instance.module';
import { SubmissionModule } from './submission/submission.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AppBullModule,
    HealthModule,
    AuthModule,
    InstanceModule,
    SubmissionModule,
    WebhookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
