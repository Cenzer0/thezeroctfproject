import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import Redis from 'ioredis';

const SubmitSchema = z.object({ challengeId: z.string(), flag: z.string().min(1) });

function hash(str: string) {
  // simple hash placeholder
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h.toString(16);
}

@Injectable()
export class SubmissionService {
  private redis: Redis;
  constructor(private prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async submit(userId: string, input: z.infer<typeof SubmitSchema>, context: { ip?: string; ua?: string }) {
    const data = SubmitSchema.parse(input);
    const challenge = await this.prisma.challenge.findUnique({ where: { id: data.challengeId } });
    if (!challenge) throw new BadRequestException('Invalid challenge');

    // Rate limit & cooldown
    const key = `sub:${userId}:${data.challengeId}`;
    const attempts = await this.redis.incr(key);
    if (attempts === 1) await this.redis.expire(key, 60); // window 60s
    const THRESHOLD = 5;
    if (attempts > THRESHOLD) {
      const cooldownKey = `cooldown:${userId}:${data.challengeId}`;
      const ttl = await this.redis.ttl(cooldownKey);
      if (ttl <= 0) await this.redis.set(cooldownKey, '1', 'EX', 60 * 5); // 5 min cooldown
      throw new ForbiddenException(`Cooldown active. Try later.`);
    }

    // Validate regex
    const regex = new RegExp(challenge.flagRegex);
    const matchesFormat = regex.test(data.flag);
    if (!matchesFormat) throw new BadRequestException('Invalid flag format');

    // Anti-cheat auditing
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'submit',
        entity: 'challenge',
        entityId: data.challengeId,
        meta: { ip: hash(context.ip || ''), ua: hash(context.ua || '') },
      },
    });

    const solved = await this.prisma.submission.findFirst({ where: { userId, challengeId: data.challengeId, correct: true } });
    if (solved) throw new BadRequestException('Already solved');

    const correct = true; // placeholder
    await this.prisma.submission.create({ data: { userId, challengeId: data.challengeId, flag: data.flag, correct } });

    if (correct) {
      const awarded = await this.handleScoringOnSolve(userId, data.challengeId);
      await this.awardBadges(userId, data.challengeId, awarded.rank);
    }

    return { correct };
  }

  private async handleScoringOnSolve(userId: string, challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) return { rank: undefined } as any;

    // Dynamic scoring
    const base = challenge.points;
    const decayFactor = 0.05;
    const pointsMin = Math.max(10, Math.floor(base * 0.2));
    const solvesCount = await this.prisma.submission.count({ where: { challengeId, correct: true } });
    const current = Math.max(pointsMin, Math.round(base * Math.E ** (-decayFactor * solvesCount)));

    await this.prisma.scoreEvent.create({ data: { userId, challengeId, points: current, reason: 'solve' } });

    // Bloods
    const existing = await this.prisma.blood.findMany({ where: { challengeId }, orderBy: { rank: 'asc' } });
    let rank: number | undefined = undefined;
    if (existing.length < 3) {
      rank = existing.length + 1;
      await this.prisma.blood.create({ data: { challengeId, userId, rank } });
      // Discord embed for blood
      try {
        const { enqueueDiscordEmbed } = await import('../webhook/queue/webhook.queue');
        await enqueueDiscordEmbed(this.prisma as any, async (_n, _d) => {}, {
          title: `Blood #${rank}`,
          description: `User ${userId} solved challenge ${challengeId}`,
          color: 15158332,
        }, 'challenge.blood');
      } catch {}
    }
    return { rank };
  }

  private async awardBadges(userId: string, challengeId: string, rank?: number) {
    // Blood badge
    if (typeof rank === 'number' && rank >= 1 && rank <= 3) {
      await this.prisma.badge.create({ data: { userId, type: 'BLOOD' as any, label: `#${rank} blood`, data: { challengeId, rank } } });
    }
    // Top-10 badge for first 10 solvers
    const solves = await this.prisma.submission.count({ where: { challengeId, correct: true } });
    if (solves <= 10) {
      await this.prisma.badge.create({ data: { userId, type: 'TOP10' as any, label: 'Top 10 Solver', data: { challengeId, position: solves } } });
    }
    // Streak badge (naive): if solved on N consecutive days
    const N = 3;
    const recent = await this.prisma.submission.findMany({ where: { userId, correct: true }, orderBy: { createdAt: 'desc' }, take: N });
    if (recent.length === N) {
      const ok = recent.every((s: { createdAt: Date }, i: number) => {
        const d = new Date(); d.setDate(d.getDate() - i);
        return s.createdAt.toDateString() === d.toDateString();
      });
      if (ok) await this.prisma.badge.create({ data: { userId, type: 'STREAK' as any, label: `${N}-day Streak`, data: {} } });
    }
  }

  async claimHint(userId: string, hintId: string) {
    const hint = await this.prisma.challengeHint.findUnique({ where: { id: hintId } });
    if (!hint) throw new BadRequestException('Invalid hint');
    await this.prisma.hintClaim.create({ data: { userId, hintId } });

    const cost = hint.cost || 0;
    if (cost > 0) await this.prisma.scoreEvent.create({ data: { userId, challengeId: hint.challengeId, points: -cost, reason: 'hint' } });

    return { ok: true };
  }
}
