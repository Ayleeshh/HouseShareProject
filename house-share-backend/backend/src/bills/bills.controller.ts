import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';

// All routes start with 'bills'
@Controller('bills')
export class BillsController {
  // Injects service so the methods can be called
  constructor(private billsService: BillsService) {}

  // Creates a bill using data from html
  @Post()
  create(@Body() dto: CreateBillDto) {
    return this.billsService.create(dto);
  }

  // Returns a bill using household id
  @Get('household/:householdId')
  findByHousehold(@Param('householdId') id: string) {
    return this.billsService.findByHousehold(id);
  }

  // Returns bill by bill id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billsService.findOne(id);
  }

  // Deletes a bill
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.billsService.delete(id);
  }
}