import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { PrismaService } from '../../../src/modules/prisma/prisma.service';

const prismaMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  afterEach(() => jest.resetAllMocks());

  it('registers user', async () => {
    prismaMock.user.create.mockResolvedValue({ id: 'u1' });
    const r = await service.register({ email: 'a@b.com', password: 'password1', name: 'User' });
    expect(r).toEqual({ id: 'u1' });
    expect(prismaMock.user.create).toHaveBeenCalled();
  });

  it('fails login with wrong password', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', password: 'salt:hash', totpSecret: null });
    await expect(service.login({ email: 'a@b.com', password: 'nope' })).rejects.toBeTruthy();
  });
});
