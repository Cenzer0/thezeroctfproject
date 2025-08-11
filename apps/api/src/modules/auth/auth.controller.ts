import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name: string }) {
    return this.service.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string; totp?: string }) {
    return this.service.login(body);
  }
}
