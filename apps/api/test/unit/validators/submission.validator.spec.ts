import { z } from 'zod';

const SubmitSchema = z.object({ challengeId: z.string(), flag: z.string().min(1) });

describe('Submit validator', () => {
  it('rejects empty flag', () => {
    expect(() => SubmitSchema.parse({ challengeId: 'c1', flag: '' })).toThrow();
  });
  it('accepts valid', () => {
    expect(SubmitSchema.parse({ challengeId: 'c1', flag: 'CTF{abc}' })).toBeTruthy();
  });
});
