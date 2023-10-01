import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('report')
// @UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('calls')
  getNumberOfCall() {
    return this.reportService.getNumberOfCall();
  }

  @Get('calls/day')
  getNumberOfCallInDay() {
    return this.reportService.getNumberOfCallInDay();
  }

  @Get('inquiries')
  getInquiry() {
    return this.reportService.getInquiry();
  }

  @Get('registrants')
  getNumberOfRegistrants() {
    return this.reportService.getNumberOfRegistrants();
  }

  @Get('provinces/day')
  getNumberOfProvincesInDay() {
    return this.reportService.getNumberOfProvincesInDay();
  }

  @Get('provinces/week')
  getNumberOfProvincesInWeek() {
    return this.reportService.getNumberOfProvincesInWeek();
  }

  @Get('topics/day')
  getNumberOfTopicsInDay() {
    return this.reportService.getNumberOfTopicsInDay();
  }

  @Get('topics/week')
  getNumberOfTopicsInWeek() {
    return this.reportService.getNumberOfTopicsInWeek();
  }

  @Get('topics/month')
  getNumberOfTopicsInMonth() {
    return this.reportService.getNumberOfTopicsInMonth();
  }

  @Get('save')
  csvRead() {
    return this.reportService.saveArticle();
  }
}
