import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private billsService: BillsService) {}

  @Post()
  create(@Body() dto: CreateBillDto) {
    return this.billsService.create(dto);
  }

  @Get('household/:householdId')
  findByHousehold(@Param('householdId') id: string) {
    return this.billsService.findByHousehold(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.billsService.delete(id);
  }
}