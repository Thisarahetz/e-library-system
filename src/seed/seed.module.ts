import { TypeOrmModule } from '@nestjs/typeorm';
import { seedOrmConfig } from '../db/data-source';
import { SeedService } from './seed.service';
import { Module } from '@nestjs/common';
import { UserSeeder } from './users.seeder';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot(seedOrmConfig), TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [SeedService, UserSeeder],
})
export class SeedModule {}
