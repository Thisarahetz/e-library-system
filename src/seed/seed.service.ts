import { Injectable, Logger } from '@nestjs/common';
import { Promise as Bluebird } from 'bluebird';
import { DataSource } from 'typeorm';
import { UserSeeder } from './users.seeder';
import { SeederInterface } from './seeder.interface';

@Injectable()
export class SeedService {
  private readonly seeders: SeederInterface[] = [];
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly connection: DataSource, private readonly usersSeeder: UserSeeder) {
    this.seeders = [this.usersSeeder];
  }

  async seed() {
    await this.connection.synchronize(true);

    await Bluebird.each(this.seeders, async (seeder: SeederInterface) => {
      this.logger.log(`Seeding ${seeder.constructor.name}`);
      await seeder.seed();
    });
  }
}
