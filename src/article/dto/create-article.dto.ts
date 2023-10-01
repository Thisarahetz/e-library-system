import {
  IsUUID,
  IsArray,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsIn,
  ArrayNotEmpty,
  ArrayMinSize,
  MinLength,
  IsEnum,
  IsNumber,
  IsEmpty,
  IsOptional,
} from 'class-validator';

enum SupportedLanguages {
  SINHALA = 'si',
  TAMIL = 'ta',
  ENGLISH = 'en',
  OTHER = 'other',
}

type ArticleContent = {
  id?: number;
  key: string;
  name: string;
  size: string;
  fileType: string;
};

class ArticleDto {
  @IsString()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @IsEnum(SupportedLanguages)
  language: string;
}

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  topic_id: string;

  @IsString()
  @IsOptional()
  sub_topic_id: string;

  @IsArray()
  upload_content: Array<ArticleContent>;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  article: ArticleDto[];
}
