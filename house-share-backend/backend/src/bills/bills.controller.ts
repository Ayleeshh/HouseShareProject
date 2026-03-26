import {
    Body,
    Controller,
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
    constructor(private readonly billsService: BillsService) {}

    @Post()
    create(@Body() dto: CreateBillDto) {
        return this.billsService.create(dto);
    }

    @Get()
    findAll(@Query('householdId') householdId: string) {
        return this.billsService.findAllByHousehold(householdId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.billsService.findOne(id);
    }

    @Patch(':id/paid')
    markPaid(@Param('id') id: string) {
        return this.billsService.markPaid(id);
    }
}