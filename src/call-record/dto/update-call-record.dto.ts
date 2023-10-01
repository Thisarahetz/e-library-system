import { PartialType } from '@nestjs/mapped-types';
import { CreateCallRecordDto } from './create-call-record.dto';

export class UpdateCallRecordDto extends PartialType(CreateCallRecordDto) {}
