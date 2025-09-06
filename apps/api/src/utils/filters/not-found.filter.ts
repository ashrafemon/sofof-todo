import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseType } from 'src/dto/enums.dto';

@Catch(NotFoundException)
export class NotFoundFilter<T> implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      data: null,
      message: `${response.req.url} of ${response.req.method} method route not found...`,
      status: ResponseType.ERROR,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}
