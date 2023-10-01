import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactInformationDto } from './dto/create-contact-information.dto';
import { UpdateContactInformationDto } from './dto/update-contact-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactInformation } from './entities/contact-information.entity';
import { ILike, Repository } from 'typeorm';
import { ResponseData, generateResponse } from 'src/utility/response.utill';

interface SearchQuery {
  page: number;
  limit: number;
  searchQuery?: string;
}

@Injectable()
export class ContactInformationService {
  constructor(
    @InjectRepository(ContactInformation)
    private contactInformationRepository: Repository<ContactInformation>
  ) {}

  async create(createContactInformationDto: CreateContactInformationDto): Promise<ResponseData<ContactInformation>> {
    try {
      const contactInformation = await this.contactInformationRepository.create({
        ...createContactInformationDto,
      });
      const savedContactInformation = await this.contactInformationRepository.save(contactInformation);

      return generateResponse(true, 200, 'Contact Information created successfully', savedContactInformation);
    } catch (error) {
      if (error.code == '23505') {
        throw new BadRequestException('Contact Information already exists with this email');
      }
      throw error;
    }
  }

  async findAll(): Promise<ResponseData<ContactInformation[]>> {
    const contactInformations = await this.contactInformationRepository.find();
    return generateResponse(true, 200, 'Contact Informations retrieved successfully', contactInformations);
  }

  async update(
    id: string,
    updateContactInformationDto: UpdateContactInformationDto
  ): Promise<ResponseData<ContactInformation | null>> {
    try {
      const contactInformation = await this.contactInformationRepository.findOne({ where: { id } });
      if (!contactInformation) {
        throw new BadRequestException('Contact Information not found');
      }
      await this.contactInformationRepository.update(id, updateContactInformationDto);
      const updatedContactInformation = await this.contactInformationRepository.findOne({
        where: { id },
      });
      return generateResponse(true, 200, 'Contact Information updated successfully', updatedContactInformation);
    } catch (error) {
      if (error.code == '23505') {
        throw new BadRequestException('Contact Information already exists with this email');
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<ResponseData<ContactInformation | null>> {
    try {
      const contactInformation = await this.contactInformationRepository.findOne({ where: { id } });
      if (!contactInformation) {
        throw new BadRequestException('Contact Information not found');
      }
      return generateResponse(true, 200, 'Contact Information retrieved successfully', contactInformation);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<ResponseData<ContactInformation>> {
    try {
      const contactInformation = await this.contactInformationRepository.findOne({ where: { id } });
      if (!contactInformation) {
        throw new BadRequestException('Contact Information not found');
      }
      await this.contactInformationRepository.delete(id);
      return generateResponse(true, 200, 'Contact Information deleted successfully', contactInformation);
    } catch (error) {
      throw error;
    }
  }

  //get contact information by use param pagination
  async getContactInformationByPagination(search: SearchQuery): Promise<ResponseData<any>> {
    const { page, limit, searchQuery: searchTerm } = search;

    try {
      const totalContactInformation = await this.contactInformationRepository.count();

      if (totalContactInformation == 0) {
        throw new BadRequestException('Contact Information not found');
      }

      let contactInformation = null;
      let totalPages = null;

      //check pages
      if (!searchTerm) {
        const [result, total] = await this.contactInformationRepository.findAndCount({
          order: {
            id: 'ASC',
          },
          skip: page * limit - limit,
          take: limit,
        });
        contactInformation = result;
        totalPages = total;
      } else {
        const [result, total] = await this.contactInformationRepository.findAndCount({
          where: [
            { fullName: ILike(`%${searchTerm}%`) },
            { mobileNumber: ILike(`%${searchTerm}%`) },
            { departmentName: ILike(`%${searchTerm}%`) },
            { city: ILike(`%${searchTerm}%`) },
            { province: ILike(`%${searchTerm}%`) },
          ],
          order: {
            id: 'ASC',
          },
          skip: page * limit - limit,
          take: limit,
        });
        contactInformation = result;
        totalPages = total;
      }

      if (!contactInformation) {
        throw new BadRequestException('Contact Information not found');
      }

      //meta data
      const meta = {
        total: totalContactInformation,
        page: page,
        totalPages: Math.ceil(totalPages / limit),
        limit: limit,
        totalSearchResult: totalPages,
      };

      return generateResponse(true, 200, 'Contact Information retrieved successfully', { contactInformation, meta });
    } catch (error) {
      throw new BadRequestException('Contact Information not found');
    }
  }
}
