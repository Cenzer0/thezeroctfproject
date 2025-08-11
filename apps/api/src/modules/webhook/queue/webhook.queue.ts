import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

export type WebhookJob = { endpointId: string; event: string; payload: any; attempt?: number };

@Processor('webhook')
export class WebhookWorker extends WorkerHost {
  constructor(private prisma: PrismaService) { super(); }

  async process(job: Job<WebhookJob>) {
    const { endpointId, event, payload } = job.data;
    // Fetch endpoint
    const endpoint = await this.prisma.webhookEndpoint.findUnique({ where: { id: endpointId } });
    if (!endpoint || !endpoint.active) return;

    // Sign payload (HMAC)
    const crypto = await import('node:crypto');
    const body = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', endpoint.secret).update(body).digest('hex');

    try {
      const res = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-ctf-signature': sig, 'x-ctf-event': event },
        body,
      });
      await this.prisma.webhookDelivery.create({ data: { endpointId, event, payload, status: res.status, error: res.ok ? null : await res.text() } });
      if (!res.ok) throw new Error('Non-2xx');
    } catch (e: any) {
      await this.prisma.webhookDelivery.create({ data: { endpointId, event, payload, status: 0, error: String(e?.message || e) } });
      throw e;
    }
  }
}

export async function enqueueDiscordEmbed(prisma: PrismaService, queueAdd: (name: string, data: WebhookJob) => Promise<any>, embed: any, event: string) {
  const cfg = await prisma.discordConfig.findFirst({ where: { active: true } });
  if (!cfg) return;
  // Create or find a webhook endpoint mapped to Discord
  let endpoint = await prisma.webhookEndpoint.findFirst({ where: { url: cfg.webhookUrl } });
  if (!endpoint) {
    endpoint = await prisma.webhookEndpoint.create({ data: { url: cfg.webhookUrl, secret: cryptoRandom(16), active: true } });
  }
  await queueAdd('deliver', { endpointId: endpoint.id, event, payload: { embeds: [embed] } });
}

function cryptoRandom(len: number) {
  const { randomBytes } = require('node:crypto');
  return randomBytes(len).toString('hex');
}
