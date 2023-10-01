import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { generateResponse } from 'src/utility/response.utill';

@Injectable()
export class AwsService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  // Upload file to AWS S3 bucket
  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      // Define parameters for the upload
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${process.env.AWS_S3_FOLDER}/${checkFileType(file.mimetype)}/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      // Uploading files to the bucket
      const uploadCommand = new PutObjectCommand(uploadParams);
      const data = await this.s3.send(uploadCommand);
      if (data.$metadata.httpStatusCode !== 200) {
        throw new BadRequestException('Error uploading file');
      }

      //return data;
      const _data = {
        fileName: file.originalname ? file.originalname : '',
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
        key: uploadParams.Key ? uploadParams.Key : '',
        contentType: file.mimetype ? file.mimetype : 'other',
        size: file.size ? file.size : 0,
      };

      return _data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  //delete file from AWS S3 bucket
  async deleteFile(key: string): Promise<any> {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      };
      // Create a command to delete the object
      const deleteCommand = new DeleteObjectCommand(params);
      const data = await this.s3.send(deleteCommand);
      if (data.$metadata.httpStatusCode !== 204) {
        throw new BadRequestException('Error deleting file');
      }
      return generateResponse(true, 200, 'File deleted successfully', data);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}

// Check file type
function checkFileType(fileType: string) {
  if (
    fileType === 'image/png' ||
    fileType === 'image/jpeg' ||
    fileType === 'image/jpg' ||
    fileType === 'image/gif' ||
    fileType === 'image/svg+xml' ||
    fileType === 'image/webp' ||
    fileType === 'image/tiff' ||
    fileType === 'image/bmp' ||
    fileType === 'image/x-icon'
  ) {
    return 'image';
  } else if (
    fileType === 'video/mp4' ||
    fileType === 'video/mkv' ||
    fileType === 'video/avi' ||
    fileType === 'video/mov' ||
    fileType === 'video/wmv' ||
    fileType === 'video/flv' ||
    fileType === 'video/ogg' ||
    fileType === 'video/webm' ||
    fileType === 'video/3gp' ||
    fileType === 'video/3g2' ||
    fileType === 'video/mpeg' ||
    fileType === 'video/quicktime' ||
    fileType === 'video/x-msvideo' ||
    fileType === 'video/x-ms-wmv' ||
    fileType === 'video/x-flv'
  ) {
    return 'video';
  } else if (
    fileType === 'application/pdf' ||
    fileType === 'application/msword' ||
    fileType === 'application/vnd.ms-excel'
  ) {
    return 'pdf';
  } else {
    return 'other';
  }
}
