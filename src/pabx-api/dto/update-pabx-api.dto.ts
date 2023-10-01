import { PartialType } from '@nestjs/mapped-types';
import { CreatePabxApiDto } from './create-pabx-api.dto';

export class UpdatePabxApiDto extends PartialType(CreatePabxApiDto) {}
