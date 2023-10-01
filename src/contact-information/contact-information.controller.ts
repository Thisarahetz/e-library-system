import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactInformationService } from './contact-information.service';
import { CreateContactInformationDto } from './dto/create-contact-information.dto';
import { UpdateContactInformationDto } from './dto/update-contact-information.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface Search {
  page: number;
  limit: number;
  searchQuery?: string;
}

@Controller('contact_information')
@UseGuards(JwtAuthGuard)
export class ContactInformationController {
  constructor(private readonly contactInformationService: ContactInformationService) {}

  @Post()
  create(@Body() createContactInformationDto: CreateContactInformationDto) {
    return this.contactInformationService.create(createContactInformationDto);
  }

  @Get()
  findAll() {
    return this.contactInformationService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.contactInformationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactInformationDto: UpdateContactInformationDto) {
    return this.contactInformationService.update(id, updateContactInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactInformationService.remove(id);
  }

  //get contact information by user pagination
  @Get('search')
  search(@Query() search: Search) {
    return this.contactInformationService.getContactInformationByPagination(search);
  }
}
