import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ServiceSchema = z.object({ name: z.string().min(1), port: z.number().int().positive() });

export const ChallengeSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  points: z.number().int().min(0).default(100),
  flagRegex: z.string(),
  kind: z.enum(['CHALLENGE', 'MACHINE']).default('CHALLENGE'),
  tags: z.array(z.string()).default([]),
  metadata: z
    .object({
      networkNotes: z.string().optional(),
      services: z.array(ServiceSchema).optional(),
      vpnRequired: z.boolean().optional(),
      vpnNoteUrl: z.string().url().optional(),
    })
    .passthrough()
    .optional(),
});

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService, private s3: S3Client) {}

  async create(data: z.infer<typeof ChallengeSchema>) {
    const payload = ChallengeSchema.parse(data);
    const challenge = await this.prisma.challenge.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        points: payload.points,
        flagRegex: payload.flagRegex,
        kind: payload.kind as any,
        metadata: payload.metadata,
        tags: { connect: payload.tags.map((name) => ({ name })) },
      },
    });
    return challenge;
  }

  async list() {
    return this.prisma.challenge.findMany({ where: { retiredAt: null } });
  }

  async getBySlug(slug: string) {
    return this.prisma.challenge.findUnique({
      where: { slug },
      include: { hints: { orderBy: { order: 'asc' } }, attachments: true, tags: true },
    });
  }

  async retireAndArchive(id: string, writeupUrl?: string) {
    const ch = await this.prisma.challenge.findUnique({ where: { id } });
    if (!ch) return null;
    await this.prisma.$transaction([
      this.prisma.challenge.update({ where: { id }, data: { retiredAt: new Date(), isPublished: false } }),
      this.prisma.archivedChallenge.create({
        data: {
          originalId: ch.id,
          slug: ch.slug,
          title: ch.title,
          description: ch.description,
          writeupUrl,
        },
      }),
    ]);
    return { ok: true };
  }

  async getPresignedUploadUrl(challengeId: string, filename: string, contentType: string) {
    const objectKey = `challenges/${challengeId}/${Date.now()}_${filename}`;
    const cmd = new PutObjectCommand({
      Bucket: 'ctf',
      Key: objectKey,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn: 60 * 5 });
    return { url, objectKey };
  }
}
