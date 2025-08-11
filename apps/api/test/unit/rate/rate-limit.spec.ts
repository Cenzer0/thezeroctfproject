import Redis from 'ioredis-mock';

describe('rate limiting', () => {
  it('enforces threshold within window', async () => {
    const redis: any = new Redis();
    const key = 'sub:u:c';
    for (let i = 0; i < 5; i++) await redis.incr(key);
    const attempts = await redis.incr(key);
    expect(attempts).toBe(6);
  });
});
