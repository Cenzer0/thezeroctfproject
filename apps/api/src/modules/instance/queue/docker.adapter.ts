import { randomInt } from 'node:crypto';

export type RunContainerOptions = {
  name: string;
  image: string;
  ports?: { internal: number; external?: number }[];
  network?: string;
  env?: Record<string, string>;
};

export interface DockerAdapter {
  run(opts: RunContainerOptions): Promise<{ id: string; ports: { internal: number; external: number }[] }>;
  stop(nameOrId: string): Promise<void>;
  remove(nameOrId: string): Promise<void>;
  inspect(nameOrId: string): Promise<{ id: string; running: boolean }>;
}

export class LocalDockerAdapter implements DockerAdapter {
  async run(opts: RunContainerOptions) {
    // In real impl, shell out to `docker run` or use Docker Engine API
    const id = `mock-${Date.now()}`;
    const ports = (opts.ports || []).map((p) => ({ internal: p.internal, external: p.external ?? randomInt(20000, 60000) }));
    return { id, ports };
  }
  async stop(_nameOrId: string) {
    return;
  }
  async remove(_nameOrId: string) {
    return;
  }
  async inspect(nameOrId: string) {
    return { id: nameOrId, running: true };
  }
}
