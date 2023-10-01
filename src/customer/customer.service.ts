import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Customer } from './entities/customer.entity';
import { ILike, Repository } from 'typeorm';
import { generateResponse } from 'src/utility/response.utill';
import { ResponseData } from 'src/utility/response.utill';
import { UserService } from 'src/user/user.service';

interface Search {
  page: number;
  limit: number;
  searchQuery?: string;
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private userService: UserService
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<ResponseData<any>> {
    try {
      //get user id from createCustomerDto
      const user = await this.userService.findOneById(createCustomerDto.userId);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const customer = await this.customerRepository.create({
        ...createCustomerDto,
        user,
      });

      const _customer = await this.customerRepository.save(customer);

      const {
        user: { employeeId, username },
        ...customerAll
      } = _customer;

      return generateResponse(true, 200, 'Customer created successfully', {
        ...customerAll,
        user: {
          employeeId,
          username,
        },
      });
    } catch (error) {
      if (error.code == '23505') {
        throw new BadRequestException('Customer already exists with this NIC');
      }
      throw error;
    }
  }

  async findAll(): Promise<ResponseData<Customer[]>> {
    // const customers = await this.customerRepository.createQueryBuilder('customer').select('user.username').relation('user').of('customer').loadMany();

    const customers = await this.customerRepository.find({
      relations: ['user'],
      select: {
        user: {
          username: true,
          employeeId: true,
        },
      },
    });

    if (!customers) {
      throw new BadRequestException('Customers not found');
    }

    return generateResponse(true, 200, 'Customers retrieved successfully', customers);
  }

  async findOne(id: string): Promise<Customer | any> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id },
        relations: ['user'],
        select: {
          user: {
            username: true,
            employeeId: true,
          },
        },
      });

      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
      return generateResponse(true, 200, 'Customer retrieved successfully', customer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneByDetails(
    page: number,
    limit: number,
    fullName: string,
    mobileNumber: string,
    nicNumber: string
  ): Promise<ResponseData<Customer[] | any>> {
    try {
      // console.log(fullName, mobileNumber, nicNumber);
      if (!fullName && !mobileNumber && !nicNumber) {
        throw new BadRequestException('Customer not found');
      }

      //get customer details with pagination
      const [result, total] = await this.customerRepository.findAndCount({
        where: [
          { fullName: ILike(`%${fullName}%`) },
          { mobileNumber: ILike(`%${mobileNumber}%`) },
          { nicNumber: ILike(`%${nicNumber}%`) },
        ],
        relations: ['user'],
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

      if (!result || result.length == 0) {
        throw new BadRequestException('Customer not found');
      }

      //meta data
      const meta = {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      };

      return generateResponse(true, 200, 'Customer retrieved successfully', {
        result,
        meta,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<ResponseData<Customer | null>> {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
      await this.customerRepository.update(id, updateCustomerDto);
      const updatedCustomer = await this.customerRepository.findOne({
        where: { id },
        relations: ['user'],
        select: {
          user: {
            username: true,
            employeeId: true,
          },
        },
      });
      return generateResponse(true, 200, 'Customer updated successfully', updatedCustomer);
    } catch (error) {
      if (error.code == '23505') {
        throw new BadRequestException('Customer already exists with this NIC');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<ResponseData<Customer | null>> {
    try {
      const customer = await this.customerRepository.findOneBy({ id });
      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
      await this.customerRepository.delete(id);
      return generateResponse(true, 200, 'Customer deleted successfully', customer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async search(search: Search): Promise<ResponseData<any>> {
    const { page, limit, searchQuery: searchTerm } = search;

    try {
      const totalcustomerInformation = await this.customerRepository.count();

      if (totalcustomerInformation == 0) {
        throw new BadRequestException('customer Information not found');
      }

      let customerInformation = null;
      let totalPages = null;

      //check pages
      if (!searchTerm) {
        const [result, total] = await this.customerRepository.findAndCount({
          order: {
            id: 'ASC',
          },
          skip: page * limit - limit,
          take: limit,
          relations: ['user'],
          select: {
            user: {
              username: true,
              employeeId: true,
            },
          },
        });

        customerInformation = result;
        totalPages = total;
      } else {
        const [result, total] = await this.customerRepository.findAndCount({
          where: [
            { fullName: ILike(`%${searchTerm}%`) },
            { mobileNumber: ILike(`%${searchTerm}%`) },
            { whatsappNumber: ILike(`%${searchTerm}%`) },
            { city: ILike(`%${searchTerm}%`) },
            { province: ILike(`%${searchTerm}%`) },
            {
              user: {
                employeeId: ILike(`%${searchTerm}%`),
              },
            },
          ],
          relations: ['user'],
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
        customerInformation = result;
        totalPages = total;
      }

      if (!customerInformation) {
        throw new BadRequestException('customer Information not found');
      }

      //meta data
      const meta = {
        total: totalcustomerInformation,
        page: page,
        totalPages: Math.ceil(totalPages / limit),
        limit: limit,
        totalSearchResult: totalPages,
      };

      return generateResponse(true, 200, 'customer Information retrieved successfully', { customerInformation, meta });
    } catch (error) {
      throw new BadRequestException('Customer Information not found');
    }
  }

  //find customer by user phone number
  async findOneByMobileNumber(phoneNumber: string): Promise<ResponseData<any>> {
    try {
      const customer = await this.customerRepository.findOne({
        where: [{ mobileNumber: ILike(`%${phoneNumber}%`) }],
      });

      return generateResponse(true, 200, 'Customer retrieved successfully', customer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
