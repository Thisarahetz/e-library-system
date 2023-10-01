//update profile dto

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

//new_password and old_password are optional because user can update profile without changing password but if get new password user enter old password
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  readonly profile_image: string;

  @IsOptional()
  @IsString()
  readonly old_password: string;

  @IsOptional()
  @IsString()
  readonly new_password: string;
}
