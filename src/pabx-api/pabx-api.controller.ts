import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Headers,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PabxApiService } from './pabx-api.service';
import { CreatePabxApiDto } from './dto/create-pabx-api.dto';
import { UpdatePabxApiDto } from './dto/update-pabx-api.dto';
import { log } from 'console';
import { AuthGuard } from '@nestjs/passport';
import { EventsGateway } from 'src/events/events.gateway';

interface Search {
  page: number;
  limit: number;
  searchQuery?: string;
}

@Controller('pabx')
export class PabxApiController {
  constructor(private readonly pabxApiService: PabxApiService) { }

  @Post('history')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('api-key'))
  create(@Body() createPabxApiDto: CreatePabxApiDto) {
    // if (apiKey !== process.env.PABX_API_KEY) throw new HttpException('Invalid API Key', 401);
    return this.pabxApiService.create(createPabxApiDto);
  }

  @Get()
  findAll() {
    return this.pabxApiService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePabxApiDto: UpdatePabxApiDto) {
    return this.pabxApiService.update(+id, updatePabxApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pabxApiService.remove(+id);
  }

  @Post('call')
  @UseGuards(AuthGuard('api-key'))
  getCall(@Body() body: any) {
    return this.pabxApiService.triggerIncomeCall(body.phone_number);
  }

  @Get('search')
  search(@Query() search: Search) {
    return this.pabxApiService.search(search);
  }
}
