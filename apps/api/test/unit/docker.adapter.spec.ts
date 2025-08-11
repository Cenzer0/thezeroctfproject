import { LocalDockerAdapter } from '../../src/modules/instance/queue/docker.adapter';

describe('LocalDockerAdapter', () => {
  it('runs and returns random external port when not provided', async () => {
    const docker = new LocalDockerAdapter();
    const res = await docker.run({ name: 'test', image: 'alpine', ports: [{ internal: 1337 }] });
    expect(res.ports[0].internal).toBe(1337);
    expect(typeof res.ports[0].external).toBe('number');
  });

  it('stop/remove/inspect do not throw', async () => {
    const docker = new LocalDockerAdapter();
    await expect(docker.stop('id')).resolves.toBeUndefined();
    await expect(docker.remove('id')).resolves.toBeUndefined();
    await expect(docker.inspect('id')).resolves.toEqual({ id: 'id', running: true });
  });
});
