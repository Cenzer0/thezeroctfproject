import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { authenticator } from 'otplib';
import * as crypto from 'node:crypto';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totp: z.string().optional(),
});

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async register(input: z.infer<typeof RegisterSchema>) {
    const data = RegisterSchema.parse(input);
    const hash = this.hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: { email: data.email, name: data.name, password: hash },
    });
    return { id: user.id };
  }

  async login(input: z.infer<typeof LoginSchema>) {
    const data = LoginSchema.parse(input);
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.password || !this.verifyPassword(data.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.totpSecret) {
      if (!data.totp || !authenticator.check(data.totp, user.totpSecret)) {
        throw new UnauthorizedException('TOTP required');
      }
    }
    const token = await this.jwt.signAsync({ sub: user.id, role: 'user' });
    return { access_token: token };
  }

  generateTotpSecret(userId: string) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri('user', 'CTFPlatform', secret);
    return this.prisma.user.update({ where: { id: userId }, data: { totpSecret: secret } })
      .then(() => ({ secret, otpAuthUrl }));
  }

  private hashPassword(pwd: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(pwd, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }
  private verifyPassword(pwd: string, stored: string) {
    const [salt, hash] = stored.split(':');
    const verify = crypto.pbkdf2Sync(pwd, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verify;
  }
}
