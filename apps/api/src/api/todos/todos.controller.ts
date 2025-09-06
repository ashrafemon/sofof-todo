import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseType } from 'src/dto/enums.dto';
import { TaskQueryDto, TaskStoreDto, TaskUpdateDto } from 'src/dto/tasks.dto';
import { TodosRepository } from 'src/repositories/todos/todos.repository';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { HelperService } from 'src/utils/helper/helper.service';

@Controller('todos')
@ApiTags('Todos')
@UseGuards(AuthGuard)
export class TodosController {
  constructor(
    private readonly repo: TodosRepository,
    private readonly helper: HelperService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() queries: TaskQueryDto) {
    const res = await this.repo.getDocs({ ...queries });
    if (!res.ok && res.type === ResponseType.SERVER_ERROR) {
      return this.helper.serverException(res.data as Error);
    }
    if (!res.ok && res.type === ResponseType.ERROR) {
      return this.helper.exception(res.message, res.code);
    }
    return this.helper.entity(res.data, res.code, res.type, res.message);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() body: TaskStoreDto) {
    const res = await this.repo.createDoc(body);
    if (!res.ok && res.type === ResponseType.SERVER_ERROR) {
      return this.helper.serverException(res.data as Error);
    }
    if (!res.ok && res.type === ResponseType.ERROR) {
      return this.helper.exception(res.message, res.code);
    }
    return this.helper.entity(res.data, res.code, res.type, res.message);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async show(@Param('id') id: string, @Query() queries: { id_key?: string }) {
    const res = await this.repo.getDoc(id, { ...queries });
    if (!res.ok && res.type === ResponseType.SERVER_ERROR) {
      return this.helper.serverException(res.data as Error);
    }
    if (!res.ok && res.type === ResponseType.ERROR) {
      return this.helper.exception(res.message, res.code);
    }
    return this.helper.entity(res.data, res.code, res.type, res.message);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() body: TaskUpdateDto) {
    const res = await this.repo.updateDoc(id, body, {});
    if (!res.ok && res.type === ResponseType.SERVER_ERROR) {
      return this.helper.serverException(res.data as Error);
    }
    if (!res.ok && res.type === ResponseType.ERROR) {
      return this.helper.exception(res.message, res.code);
    }
    return this.helper.entity(res.data, res.code, res.type, res.message);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async destroy(@Param('id') id: string) {
    const res = await this.repo.deleteDoc(id, {});
    if (!res.ok && res.type === ResponseType.SERVER_ERROR) {
      return this.helper.serverException(res.data as Error);
    }
    if (!res.ok && res.type === ResponseType.ERROR) {
      return this.helper.exception(res.message, res.code);
    }
    return this.helper.entity(res.data, res.code, res.type, res.message);
  }
}
