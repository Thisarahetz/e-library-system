import { IsString, MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactInformationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  officeNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  departmentName: string;

  @IsString()
  @IsNotEmpty()
  departmentEmail: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  district: string;
}
