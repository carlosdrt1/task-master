import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end: Date;

  @IsOptional()
  @IsString()
  icon: string;

  @IsOptional()
  @IsHexColor()
  color: string;

  @IsArray()
  @IsString({ each: true })
  todoItems: string[];
}
