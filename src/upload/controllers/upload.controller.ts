import { BadRequestException, Controller, Post, UploadedFiles, UseInterceptors, Delete, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { AwsService } from '../services/aws.services';
import { ResponseDto } from '../dto/response.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly awsService: AwsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', null))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<ResponseDto[]> {
    //file size less than 10MB
    if (files.some((file) => file.size > 10 * 1024 * 1024))
      throw new BadRequestException('File is too large for the destination file system');

    if (!files) throw new BadRequestException('No files found');
    let response: ResponseDto[] = [];

    //upload files to AWS S3 bucket
    const uploadPromises = files.map((file: Express.Multer.File) => this.awsService.uploadFile(file));
    response.push(...(await Promise.all(uploadPromises)));
    return response;
  }

  //delete file from AWS S3 bucket
  @Delete()
  async deleteFile(@Query('key') key: string): Promise<any> {
    try {
      return await this.awsService.deleteFile(key);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
