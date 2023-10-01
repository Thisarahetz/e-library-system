// src/logger/logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>
  ) {}

  // private logger = new Logger('HTTP');

  async log(message: string, context?: any) {
    // this.logger.log(context?.metadata);

    const auditLog = this.auditLogRepository.create({
      message: message || 'No message',
      metadata: JSON.stringify(context?.metadata) || '{}',
      userId: context?.userId || 'anonymous',
      statusCode: context?.statusCode || 500,
    });

    await this.auditLogRepository.save(auditLog);
  }
}
