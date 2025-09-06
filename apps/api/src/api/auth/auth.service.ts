import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { LoginDto } from 'src/dto/auth.dto';
import { ResponseType } from 'src/dto/enums.dto';
import { HelperService } from 'src/utils/helper/helper.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly helper: HelperService,
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async login(body: LoginDto) {
    try {
      const user = await this.db.user.findFirst({
        where: { email: body.email },
      });

      if (!user) {
        return this.helper.funcResponser({
          type: ResponseType.VALIDATE_ERROR,
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          data: { email: 'Sorry, user not found...' },
        });
      }

      const isPasswordMatch = await this.helper.hashCheck(
        body.password,
        user.password,
      );
      if (!isPasswordMatch) {
        return this.helper.funcResponser({
          type: ResponseType.VALIDATE_ERROR,
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          data: { password: 'The password is wrong' },
        });
      }

      return await this.tokenGenerate({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (err) {
      return this.helper.funcResponser({
        type: ResponseType.SERVER_ERROR,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: err,
      });
    }
  }

  private async tokenGenerate(claims: Record<string, any>) {
    try {
      const secret = this.config.getOrThrow('JWT_SECRET');
      const algorithm = this.config.getOrThrow('JWT_ALG', 'HS256');
      const issuer = this.config.getOrThrow('APP_NAME', 'TASKIFY');
      const audience = this.config.getOrThrow('APP_NAME', 'TASKIFY');

      const token = await this.jwt.signAsync(
        { ...claims },
        {
          algorithm,
          audience,
          issuer,
          secret,
          expiresIn: '1h',
        },
      );

      if (!token) {
        return this.helper.funcResponser({
          type: ResponseType.ERROR,
          code: HttpStatus.BAD_REQUEST,
          message: 'Sorry, token is not generate successfully',
        });
      }

      return this.helper.funcResponser({
        code: HttpStatus.CREATED,
        data: { token, type: 'Bearer' },
      });
    } catch (err) {
      return this.helper.funcResponser({
        type: ResponseType.SERVER_ERROR,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: err,
      });
    }
  }
}
