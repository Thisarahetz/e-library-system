import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { CallRecordService } from './call-record.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { UpdateCallRecordDto } from './dto/update-call-record.dto';

type QueryIds = {
  customerId: string;
  userId: string;
};

type customerDetails = {
  page: number;
  limit: number;
  searchQuery?: string;
  status?: string;
};

@Controller('call_record')
export class CallRecordController {
  constructor(private readonly callRecordService: CallRecordService) {}

  @Post()
  create(@Query() queryIds: QueryIds, @Body() createCallRecordDto: CreateCallRecordDto) {
    if (!queryIds.customerId || !queryIds.userId) {
      throw new BadRequestException('Customer Id or User Id is missing');
    }

    const { customerId, userId } = queryIds;
    return this.callRecordService.create(customerId, userId, createCallRecordDto);
  }

  @Get()
  findAll(@Query() customerDetails: customerDetails) {
    return this.callRecordService.findAll(customerDetails);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callRecordService.findOne(id);
  }

  @Get('customer/:customerID')
  findByCustomerID(@Param('customerID') customerID: string) {
    return this.callRecordService.findByCustomerID(customerID);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallRecordDto: UpdateCallRecordDto) {
    return this.callRecordService.update(id, updateCallRecordDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.callRecordService.remove(+id);
  // }
}
