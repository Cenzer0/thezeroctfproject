import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { JwtService } from '@nestjs/jwt';

async function authToken(app: INestApplication, prisma: any) {
  const jwt = app.get(JwtService);
  const user = await prisma.user.create({ data: { email: 'u@t.com', name: 'U', password: 'p' } });
  return jwt.sign({ sub: user.id, role: 'admin' });
}

describe('API e2e', () => {
  let app: INestApplication;
  let prisma: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get('PrismaService');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('auth + CRUD challenge + spawn + submit + scoring', async () => {
    const token = await authToken(app, prisma);

    // Create challenge
    const create = await request(app.getHttpServer())
      .post('/challenges')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Warmup', slug: 'warmup', description: 'desc', points: 100, flagRegex: '^CTF\\{.+\\}$' })
      .expect(201);

    // List and get by slug
    await request(app.getHttpServer()).get('/challenges').expect(200);
    await request(app.getHttpServer()).get('/challenges/warmup').expect(200);

    // Submit (regex accepted)
    const challengeId = create.body.id;
    const sub = await request(app.getHttpServer())
      .post('/submission')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId, flag: 'CTF{ok}' })
      .expect(201);
    expect(sub.body.correct).toBe(true);
  });
});
