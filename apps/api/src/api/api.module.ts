import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from 'src/utils/pipes/validation.pipe';
import { NotFoundFilter } from 'src/utils/filters/not-found.filter';

@Module({
  imports: [TodosModule, AuthModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
  ],
})
export class ApiModule {}
