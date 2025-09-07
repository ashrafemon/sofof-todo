import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DefaultDto } from './base.dto';
import { TaskStatus } from './enums.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class TaskQueryDto extends DefaultDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class TaskStoreDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class TaskUpdateDto extends PartialType(TaskStoreDto) {}
