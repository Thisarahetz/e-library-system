import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { UpdateCallRecordDto } from './dto/update-call-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CallRecord } from './entities/call-record.entity';
import { ILike, Repository } from 'typeorm';
import { CustomerService } from 'src/customer/customer.service';
import { ResponseData, generateResponse } from 'src/utility/response.utill';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
type customerDetails = {
  page: number;
  limit: number;
  searchQuery?: string;
  status?: string;
};

@Injectable()
export class CallRecordService {
  constructor(
    @InjectRepository(CallRecord)
    private callRecordRepository: Repository<CallRecord>,

    readonly userService: UserService,
    private customerService: CustomerService
  ) {}

  async create(
    customerID: string,
    userId: string,
    createCallRecordDto: CreateCallRecordDto
  ): Promise<ResponseData<CallRecord>> {
    try {
      //get user
      const user = await this.userService.findOneById(userId);

      if (!user) throw new BadRequestException('User not found');

      const customer = await this.customerService.findOne(customerID);
      if (!customer) throw new BadRequestException('Customer not found');

      const callRecord = await this.callRecordRepository.create({
        ...createCallRecordDto,
        customer: customer.data,
        user: user,
      });

      await this.callRecordRepository.save(callRecord);

      return generateResponse(true, 200, 'CallRecord created successfully');
    } catch (error) {
      throw error;
    }
  }

  async findAll(customerDetails: customerDetails): Promise<ResponseData<CallRecord[] | any>> {
    try {
      const { searchQuery, page, limit, status } = customerDetails;

      const [result, total] = await this.callRecordRepository.findAndCount({
        where: [
          { customer: { fullName: ILike(`%${searchQuery}%`) } },
          { user: { employeeId: ILike(`%${searchQuery}%`) } },
          {
            customer: { mobileNumber: ILike(`%${searchQuery}%`) },
          },
          {
            problem: ILike(`%${searchQuery}%`),
          },
          {
            status: status,
          },
        ],
        relations: ['customer', 'user'],
        select: {
          user: {
            username: true,
            employeeId: true,
          },
        },
        order: {
          id: 'ASC',
        },
        skip: page * limit - limit,
        take: limit,
      });

      if (!result) {
        throw new BadRequestException('CallRecords not found');
      }

      //meta data
      const meta = {
        total: total,
        page: page,
        totalPages: Math.ceil(total / limit),
        limit: limit,
      };

      return generateResponse(true, 200, 'CallRecords retrieved successfully', {
        result,
        meta,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<ResponseData<CallRecord | null>> {
    try {
      const callRecord = await this.callRecordRepository.findOne({
        where: { id },
        relations: ['customer', 'user'],
        select: {
          user: {
            username: true,
            employeeId: true,
          },
        },
      });
      if (!callRecord) {
        throw new BadRequestException('CallRecord not found');
      }
      return generateResponse(true, 200, 'CallRecord retrieved successfully', callRecord);
    } catch (error) {
      throw error;
    }
  }

  async findByCustomerID(customerID: string): Promise<ResponseData<CallRecord[]>> {
    try {
      const callRecord = await this.callRecordRepository.find({
        where: { customer: { id: customerID } },
      });
      console.log('firstCallRecord', callRecord);
      if (callRecord.length == 0) {
        throw new BadRequestException('Customer not found');
      }
      return generateResponse(true, 200, 'CallRecords retrieved successfully', callRecord);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCallRecordDto: UpdateCallRecordDto): Promise<ResponseData<CallRecord | null>> {
    try {
      const callRecord = await this.callRecordRepository.findOne({
        where: { id },
      });
      if (!callRecord) {
        throw new BadRequestException('CallRecord not found');
      }
      await this.callRecordRepository.update(id, updateCallRecordDto);
      const updatedCallRecord = await this.callRecordRepository.findOne({
        where: { id },
      });
      return generateResponse(true, 200, 'CallRecord updated successfully', updatedCallRecord);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<CallRecord> {
    try {
      const callRecord = await this.callRecordRepository.findOneBy({ id });
      if (!callRecord) {
        throw new BadRequestException('CallRecord not found');
      }
      await this.callRecordRepository.delete(id);
      return callRecord;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
