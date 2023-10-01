import {
  IsEmail,
  IsBoolean,
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  ArrayNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/auth/enums';

class Action {
  @IsString()
  id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  action: number[];

  @IsString()
  category_id: string;

  @IsString()
  category_name: string;

  @IsString()
  category_type: string;
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  employee_id: string | null;

  @IsString()
  @IsOptional()
  user_id: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean | null;

  @IsString()
  @IsOptional()
  password: string | null;

  @IsBoolean()
  status: boolean;

  @ValidateNested({ each: true })
  actions: Action[];
}
