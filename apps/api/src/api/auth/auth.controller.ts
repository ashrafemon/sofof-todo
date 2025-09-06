import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from 'src/dto/auth.dto';
import { ResponseType } from 'src/dto/enums.dto';
import { HelperService } from 'src/utils/helper/helper.service';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly helper: HelperService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() body: LoginDto) {
    const res = await this.service.login(body);
    if (!res.ok && res.type === ResponseType.SERVER_ERROR) {
      return this.helper.serverException(res.data as Error);
    }
    if (!res.ok && res.type === ResponseType.ERROR) {
      return this.helper.exception(res.message, res.code);
    }
    if (!res.ok && res.type === ResponseType.VALIDATE_ERROR) {
      return this.helper.validateException(res.data);
    }
    return this.helper.entity(
      res.data,
      res.code,
      res.type,
      'You are successfully logged in',
    );
  }
}
