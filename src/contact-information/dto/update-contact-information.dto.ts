import { PartialType } from '@nestjs/mapped-types';
import { CreateContactInformationDto } from './create-contact-information.dto';

export class UpdateContactInformationDto extends PartialType(CreateContactInformationDto) {}
