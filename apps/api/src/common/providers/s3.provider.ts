import { Provider } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

export const S3_CLIENT = Symbol('S3_CLIENT');

export const S3Provider: Provider = {
  provide: S3_CLIENT,
  useFactory: () =>
    new S3Client({
      region: 'us-east-1',
      forcePathStyle: true,
      endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:9000`,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minio',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minio12345',
      },
    }),
};
