import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsStringOrStringArray } from 'src/utils/decorators/string_array.decorator';
import { OrderBy } from './enums.dto';

export type RequestWithAuth = Request & {
  auth: {
    id: string;
  };
};

export class DefaultDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id_key?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fields?: string | string[];

  @ApiPropertyOptional({ type: [String], name: 'relations[]' })
  @IsStringOrStringArray()
  @IsOptional()
  'relations[]'?: string | string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  get_all?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  get_first?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  order_field?: string;

  @ApiPropertyOptional({ enum: OrderBy })
  @IsEnum(OrderBy)
  @IsOptional()
  order_by?: OrderBy;
}
