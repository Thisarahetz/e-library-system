import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CallRecord } from 'src/call-record/entities/call-record.entity';
import { Between, In, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { generateResponse } from 'src/utility/response.utill';
import { Customer } from 'src/customer/entities/customer.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryService } from 'src/category/category.service';
import { CategoryContent } from 'src/category/entities/categoryContent.entity';
import { ArticleService } from 'src/article/article.service';
import { ArticleContent } from 'src/article/entities/articleContent.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(CallRecord)
    private callRecordRepository: Repository<CallRecord>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    private articleService: ArticleService,


  ) { }

  //get number of call
  async getNumberOfCall() {
    try {
      const numberOfCall = await this.callRecordRepository.count();
      return generateResponse(true, 200, 'Number of call', {
        numberOfCall: numberOfCall,
      });
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //get number of call in today
  async getNumberOfCallInDay() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the start of the next day

      const count = await this.callRecordRepository.count({
        where: {
          createdAt: Between(today, tomorrow),
        },
      });

      return generateResponse(true, 200, 'Number of call in today', {
        numberOfCall: count,
      });
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //get number of inquiry
  async getInquiry() {
    try {
      const inquiries = await this.callRecordRepository.count();

      const pendingInquiry = await this.callRecordRepository.count({
        where: {
          status: 'Open',
        },
      });

      return generateResponse(true, 200, 'Number of Inquiries', {
        totalInquiry: inquiries,
        pendingInquiry: pendingInquiry,
      });
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //get number of registration in today
  async getNumberOfRegistrants() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the start of the next day

      const count = await this.customerRepository
        .createQueryBuilder('customer')
        .where('customer.createdAt >= :today', { today })
        .andWhere('customer.createdAt < :tomorrow', { tomorrow })
        .getCount();
      return generateResponse(true, 200, 'Number of registrants Today', {
        numberOfRegToday: count,
      });
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //number of call in today
  async getNumberOfProvincesInDay() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the start of the next day

      //count of call in recode
      const count = await this.callRecordRepository.count();

      if (!count) return generateResponse(false, 404, 'No call record found', null);

      //get number of call in today group by province
      const customer = await this.callRecordRepository
        .createQueryBuilder('call-record')
        .leftJoin('call-record.customer', 'customer')
        .select('customer.province', 'province')
        .addSelect('COUNT(call-record.id)', 'count')
        .where('customer.createdAt >= :today', { today })
        .andWhere('customer.createdAt < :tomorrow', { tomorrow })
        .groupBy('customer.province')
        .orderBy('count', 'DESC')
        .getRawMany();

      // set parentage of each province
      const _tempProvince = customer.map((item) => {
        item.percentage = (item.count / count) * 100;
        return item;
      });

      // let _tempArr = _tempProvince.slice(0, 4);

      // return data max 4 province and other
      if (_tempProvince.length > 4) {
        const _temp = _tempProvince.slice(0, 4);
        const _other = _tempProvince.slice(4, _tempProvince.length);
        const _otherCount = _other.reduce((a, b): number => Number(a) + Number(b.count), 0);
        const _otherPercentage = (_otherCount / count) * 100;
        _temp.push({
          province: 'Other',
          count: _otherCount.toString(),
          percentage: _otherPercentage,
        });
        return generateResponse(true, 200, 'Number of call Today', [..._temp]);
      }

      return generateResponse(true, 200, 'Number of call Today', [..._tempProvince]);
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //number of call in week
  async getNumberOfProvincesInWeek() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the start of the next day

      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7); // Set time to the start of the next day

      //count of call in recode
      const count = await this.callRecordRepository.count();

      if (!count) return generateResponse(false, 404, 'No call record found', null);

      //get number of call in week group by province
      const customer = await this.callRecordRepository
        .createQueryBuilder('call-record')
        .leftJoin('call-record.customer', 'customer')
        .select('customer.province', 'province')
        .addSelect('COUNT(call-record.id)', 'count')
        .where('customer.createdAt >= :lastWeek', { lastWeek })
        .andWhere('customer.createdAt < :tomorrow', { tomorrow })
        .groupBy('customer.province')
        .orderBy('count', 'DESC')
        .getRawMany();

      // set parentage of each province
      const _tempProvince = customer.map((item) => {
        item.percentage = (item.count / count) * 100;
        return item;
      });

      // let _tempArr = _tempProvince.slice(0, 4);

      // return data max 4 province and other
      if (_tempProvince.length > 4) {
        const _temp = _tempProvince.slice(0, 4);
        const _other = _tempProvince.slice(4, _tempProvince.length);
        const _otherCount = _other.reduce((a, b): number => Number(a) + Number(b.count), 0);
        const _otherPercentage = (_otherCount / count) * 100;
        _temp.push({
          province: 'Other',
          count: _otherCount.toString(),
          percentage: _otherPercentage,
        });
        return generateResponse(true, 200, 'Number of call week', [..._temp]);
      }

      return generateResponse(true, 200, 'Number of call week', [..._tempProvince]);
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //number of topics in day
  async getNumberOfTopicsInDay() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the start of the next day

      //count of call in recode
      const count = await this.callRecordRepository.count();

      if (!count) return generateResponse(false, 404, 'No call record found', null);

      //get number of call in today group by topics
      const topics = await this.callRecordRepository
        .createQueryBuilder('call-record')
        .select('call-record.topic', 'topic')
        .addSelect('COUNT(call-record.id)', 'count')
        .where('call-record.createdAt >= :today', { today })
        .andWhere('call-record.createdAt < :tomorrow', { tomorrow })
        .groupBy('call-record.topic')
        .orderBy('count', 'DESC')
        .getRawMany();

      // set parentage of each province
      const _tempProvince = topics.map((item) => {
        item.percentage = (item.count / count) * 100;
        return item;
      });

      // let _tempArr = _tempProvince.slice(0, 4);

      // return data max 4 province and other
      if (_tempProvince.length > 4) {
        const _temp = _tempProvince.slice(0, 4);
        const _other = _tempProvince.slice(4, _tempProvince.length);
        const _otherCount = _other.reduce((a, b): number => Number(a) + Number(b.count), 0);
        const _otherPercentage = (_otherCount / count) * 100;
        _temp.push({
          topic: 'Other',
          count: _otherCount.toString(),
          _otherCount,
          percentage: _otherPercentage,
        });
        return generateResponse(true, 200, 'Number of call week', [..._temp]);
      }

      return generateResponse(true, 200, 'Number of call week', [..._tempProvince]);
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //number of topics in week
  async getNumberOfTopicsInWeek() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7); // Set time to the start of the next day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the start of the next day

      //count of call in recode
      const count: number = await this.callRecordRepository.count();

      if (!count) return generateResponse(false, 404, 'No call record found', null);

      ///get number of call in today group by topics
      const topics = await this.callRecordRepository
        .createQueryBuilder('call-record')
        .select('call-record.topic', 'topic')
        .addSelect('COUNT(call-record.id)', 'count')
        .where('call-record.createdAt >= :lastWeek', { lastWeek })
        .andWhere('call-record.createdAt < :tomorrow', { tomorrow })
        .groupBy('call-record.topic')
        .orderBy('count', 'DESC')
        .getRawMany();

      // set parentage of each province
      const _tempProvince = topics.map((item) => {
        item.percentage = (Number(item.count) / count) * 100;
        return item;
      });

      // let _tempArr = _tempProvince.slice(0, 4);

      // return data max 4 province and other
      if (_tempProvince.length > 4) {
        const _temp = _tempProvince.slice(0, 4);
        const _other = _tempProvince.slice(4, _tempProvince.length);
        const _otherCount = _other.reduce((a, b): number => Number(a) + Number(b.count), 0);
        const _otherPercentage = (_otherCount / count) * 100;
        _temp.push({
          topic: 'Other',
          count: _otherCount.toString(),
          percentage: _otherPercentage,
        });
        return generateResponse(true, 200, 'Number of call week', [..._temp]);
      }

      return generateResponse(true, 200, 'Number of call week', [..._tempProvince]);
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //number of topics in month
  async getNumberOfTopicsInMonth() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set time to the start of the next day

      const lastMonth = new Date(today);
      lastMonth.setDate(lastMonth.getDate() - 30); // Set time to the start of the next day

      //count of call in recode
      const count: number = await this.callRecordRepository.count();

      if (!count) return generateResponse(false, 404, 'No Topic found', null);

      const topics = await this.callRecordRepository
        .createQueryBuilder('call-record')
        .select('call-record.topic', 'topic')
        .addSelect('COUNT(call-record.id)', 'count')
        .where('call-record.createdAt >= :lastMonth', { lastMonth })
        .andWhere('call-record.createdAt < :tomorrow', { tomorrow })
        .groupBy('call-record.topic')
        .orderBy('count', 'DESC')
        .getRawMany();

      // set parentage of each province
      const _tempProvince = topics.map((item) => {
        item.percentage = (item.count / count) * 100;
        return item;
      });

      // let _tempArr = _tempProvince.slice(0, 4);

      // return data max 4 province and other
      if (_tempProvince.length > 4) {
        const _temp = _tempProvince.slice(0, 4);
        const _other = _tempProvince.slice(4, _tempProvince.length);
        const _otherCount = _other.reduce((a, b): number => Number(a) + Number(b.count), 0);
        const _otherPercentage = (_otherCount / count) * 100;
        _temp.push({
          topic: 'Other',
          count: _otherCount.toString(),
          percentage: _otherPercentage,
        });
        return generateResponse(true, 200, 'Number of call week', [..._temp]);
      }

      return generateResponse(true, 200, 'Number of call week', [..._tempProvince]);
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }

  //read csv and save to database
  async saveArticle() {
    try {
      // const csv = require('csv-parser');
      const csv = require('fast-csv');
      const fs = require('fs');
      const results = [];
      const _result = [];

      //type of data
      type Topic = {
        title: string,
        language: string,
        description: string,
        topicid: string,
      };

      fs.createReadStream('src/report/csv-bulk/Article.csv')
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', (data: any) => results.push(data))
        // .on('data', (data: any) => results.push({
        //   article: {
        //     id: data.topicId,
        //     title: data.title,
        //     description: data.description,
        //     language: data.language,
        //     data: data
        //   }
        // }))
        .on('end', async () => {

          results.forEach(async (topics: Topic) => {

            console.log(topics);

            //destructuring topic to CreateArticleDto
            // const { id, type, topic, parentId, language } = topics;

            // await this.articleService.create({});

          });


          return generateResponse(true, 200, 'Read csv success', null);
        });
    } catch (error) {
      return generateResponse(false, 500, 'Internal server error', error);
    }
  }


  //generate UUID4
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16).toUpperCase();
    });
  }


}
