import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface Search {
  page: number;
  limit: number;
  searchQuery?: string;
}

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post(':id')
  create(@Param('id') id: string, @Body() createCustomerDto: CreateCustomerDto) {
    createCustomerDto.userId = id;
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get('details')
  findOneByDetails(
    @Query('fullName') fullName: string,
    @Query('mobileNumber') mobileNumber: string,
    @Query('nicNumber') nicNumber: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    //set default values page = 1 and limit = 10
    page = page ? page : 1;
    limit = limit ? limit : 10;
    return this.customerService.findOneByDetails(page, limit, fullName, mobileNumber, nicNumber);
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }

  @Get('search')
  search(@Query() search: Search) {
    return this.customerService.search(search);
  }

}
