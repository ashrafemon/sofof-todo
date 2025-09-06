import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TodosRepositoryModule } from 'src/repositories/todos/todos.module';
import { TodosController } from './todos.controller';

@Module({
  imports: [JwtModule, TodosRepositoryModule],
  controllers: [TodosController],
})
export class TodosModule {}
