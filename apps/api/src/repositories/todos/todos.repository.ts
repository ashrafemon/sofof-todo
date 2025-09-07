import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ResponseType } from 'src/dto/enums.dto';
import { TaskQueryDto, TaskStoreDto, TaskUpdateDto } from 'src/dto/tasks.dto';
import { HelperService } from 'src/utils/helper/helper.service';

@Injectable()
export class TodosRepository {
  constructor(
    private readonly helper: HelperService,
    private readonly db: DatabaseService,
  ) {}

  async getDocs(queries: TaskQueryDto) {
    try {
      const condition: Record<string, any> = {};
      const { page, offset, skip, take } = this.helper.getPageOffset(
        queries.page,
        queries.offset,
      );
      const fields: Record<string, boolean | unknown> = Object.assign(
        {
          id: true,
          title: true,
          status: true,
        },
        this.helper.getFieldRelations(queries.fields, queries['relations[]']),
      );

      if (queries.status) condition.status = queries.status;
      if (queries.userId) condition.userId = queries.userId;
      if (queries.search) condition.name = { contains: queries.search };

      const orderKey = queries.order_field ?? 'createdAt';
      const orderValue = queries.order_by ?? 'asc';

      if (queries.get_all) {
        const docs = await this.db.task.findMany({
          where: condition,
          select: fields,
          orderBy: { [orderKey]: orderValue },
        });

        return this.helper.funcResponser({ data: docs });
      }

      const [count, docs] = await this.db.$transaction([
        this.db.task.count({ where: condition }),
        this.db.task.findMany({
          select: fields,
          where: condition,
          skip: skip,
          take: take,
          orderBy: { [orderKey]: orderValue },
        }),
      ]);

      return this.helper.funcResponser({
        data: this.helper.paginate(count, docs, page, offset),
      });
    } catch (err) {
      return this.helper.funcResponser({
        type: ResponseType.SERVER_ERROR,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: err,
      });
    }
  }

  async getDoc(id: string, queries: TaskQueryDto) {
    try {
      const fields: Record<string, boolean | unknown> = Object.assign(
        {
          id: true,
          title: true,
          description: true,
          status: true,
        },
        this.helper.getFieldRelations(queries.fields, queries['relations[]']),
      );

      const idKey = queries.id_key ?? 'id';
      const condition: Record<string, any> = { [idKey]: id };
      if (queries.userId) condition.userId = queries.userId;

      const doc = await this.db.task.findFirst({
        where: condition,
        select: fields,
      });

      if (!doc) {
        return this.helper.funcResponser({
          type: ResponseType.ERROR,
          code: HttpStatus.NOT_FOUND,
          message: 'Task not found.',
        });
      }

      return this.helper.funcResponser({ data: doc });
    } catch (err) {
      return this.helper.funcResponser({
        type: ResponseType.SERVER_ERROR,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: err,
      });
    }
  }

  async createDoc(body: TaskStoreDto) {
    try {
      const doc = await this.db.task.create({
        data: body,
        omit: { createdAt: true, updatedAt: true },
      });
      return this.helper.funcResponser({
        data: doc,
        message: `Task added successfully`,
        code: HttpStatus.CREATED,
      });
    } catch (err) {
      return this.helper.funcResponser({
        type: ResponseType.SERVER_ERROR,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: err,
      });
    }
  }

  async updateDoc(
    id: string,
    body: TaskUpdateDto,
    queries?: { id_key?: string; userId?: string },
  ) {
    try {
      const idKey = queries.id_key ?? 'id';
      const condition: Record<string, any> = { [idKey]: id };
      if (queries.userId) condition.userId = queries.userId;

      let doc = await this.db.task.findFirst({
        where: condition,
        omit: { createdAt: true, updatedAt: true },
      });
      if (!doc) {
        return this.helper.funcResponser({
          type: ResponseType.ERROR,
          code: HttpStatus.NOT_FOUND,
          message: 'Task not found...',
        });
      }

      doc = await this.db.task.update({
        where: { id: doc.id },
        data: body,
        omit: { createdAt: true, updatedAt: true },
      });
      return this.helper.funcResponser({
        data: doc,
        message: `Task updated successfully`,
      });
    } catch (err) {
      return this.helper.funcResponser({
        type: ResponseType.SERVER_ERROR,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: err,
      });
    }
  }

  async deleteDoc(id: string, queries?: { id_key?: string; userId?: string }) {
    try {
      const idKey = queries.id_key ?? 'id';
      const condition: Record<string, any> = { [idKey]: id };
      if (queries.userId) condition.userId = queries.userId;

      const doc = await this.db.task.findFirst({ where: condition });
      if (!doc) {
        return this.helper.funcResponser({
          type: ResponseType.ERROR,
          code: HttpStatus.NOT_FOUND,
          message: 'Task not found...',
        });
      }

      await this.db.task.delete({ where: { id: doc.id } });
      return this.helper.funcResponser({
        data: doc,
        message: `Task deleted successfully`,
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
