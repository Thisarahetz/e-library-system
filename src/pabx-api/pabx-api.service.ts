import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreatePabxApiDto } from './dto/create-pabx-api.dto';
import { UpdatePabxApiDto } from './dto/update-pabx-api.dto';
import { Pabx } from './entities/pabx-api.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData, generateResponse } from 'src/utility/response.utill';
import { EventsGateway } from 'src/events/events.gateway';
import { CustomerService } from 'src/customer/customer.service';

interface Search {
  page: number;
  limit: number;
  searchQuery?: string;
}

@Injectable()
export class PabxApiService {
  constructor(
    @InjectRepository(Pabx)
    private pabxApiRepository: Repository<Pabx>,
    private readonly eventsGateway: EventsGateway,
    private readonly customerService: CustomerService
  ) { }
  async create(createPabxApiDto: CreatePabxApiDto): Promise<any> {
    //destructuring the createPabxApiDto object
    const { call_type, call_date, call_time, call_duration, dialed_no, station } = createPabxApiDto;

    //create a new object with the destructured values
    const newPabx = {
      callType: call_type,
      callDate: call_date,
      callTime: call_time,
      callDuration: call_duration,
      dialedNo: dialed_no.toString(),
      station: station,
    };
    try {
      const pabx = await this.pabxApiRepository.create(newPabx);
      await this.pabxApiRepository.save(pabx);
      return generateResponse(true, 201, 'Call record saved successfully');
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findAll() {
    try {
      return this.pabxApiRepository.find(
        {
          order: {
            createdAt: 'DESC',
          },
        }
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  async triggerIncomeCall(number: string) {
    try {
      const customer = await this.customerService.findOneByMobileNumber(number);
      this.eventsGateway.incomingCall({ number: number.toString(), username: customer?.data?.fullName, isCustomer: customer?.data?.id ? true : false });
      return generateResponse(true, 200, 'Call triggered successfully');
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }

  }

  update(id: number, updatePabxApiDto: UpdatePabxApiDto) {
    return `This action updates a #${id} pabxApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} pabxApi`;
  }

  async search(search: Search): Promise<ResponseData<any>> {
    const { page, limit, searchQuery: searchTerm } = search;

    try {
      const callLogsTotal = await this.pabxApiRepository.count();

      if (callLogsTotal == 0) {
        throw new BadRequestException('Call Logs Information not found');
      }

      let callLogInformation = null;
      let totalPages = null;

      //check pages
      if (!searchTerm) {
        const [result, total] = await this.pabxApiRepository.findAndCount({
          skip: page * limit - limit,
          take: limit,
          order: {
            createdAt: 'DESC',
          },
        });

        callLogInformation = result;
        totalPages = total;
      } else {
        const [result, total] = await this.pabxApiRepository.findAndCount({
          where: [
            { dialedNo: ILike(`%${searchTerm}%`) },
          ],
          order: {
            createdAt: 'DESC',
          },
          skip: page * limit - limit,
          take: limit,
        });
        callLogInformation = result;
        totalPages = total;
      }

      if (!callLogsTotal) {
        throw new BadRequestException('callLogs Information not found');
      }

      //meta data
      const meta = {
        total: callLogsTotal,
        page: page,
        totalPages: Math.ceil(totalPages / limit),
        limit: limit,
        totalSearchResult: totalPages,
      };

      return generateResponse(true, 200, 'callLogs Information retrieved successfully', { result: callLogInformation, meta });
    } catch (error) {
      throw new BadRequestException('callLogs Information not found');
    }
  }
}
