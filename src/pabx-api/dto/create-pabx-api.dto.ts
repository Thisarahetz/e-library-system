import { IsOptional, IsNumber, IsString, ValidateNested, IsEnum } from 'class-validator';
import { IsStringOrNumber } from 'src/share/IsStringOrNumberDecorator';

export class CreatePabxApiDto {
  @IsString()
  call_type: string;

  @IsString()
  call_date: string;

  @IsString()
  call_time: string;

  @IsString()
  call_duration: string;

  //is this a number can be string or number
  @IsStringOrNumber()
  dialed_no: string | number;

  @IsString()
  station: string;
}
