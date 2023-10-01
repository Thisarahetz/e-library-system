import { IsOptional, IsNumber, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Language, Type } from '../enums';

class TopicTranslations {
  @IsString()
  [Language.ENGLISH]: string;

  @IsString()
  [Language.SINHALA]: string;

  @IsString()
  [Language.TAMIL]: string;
}

export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  parent_id: string;

  @IsEnum(Type)
  type: string;

  @ValidateNested()
  topic: TopicTranslations;
}
