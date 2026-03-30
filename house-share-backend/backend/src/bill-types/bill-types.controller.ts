import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BillTypesService } from './bill-types.service';
import { CreateBillTypeDto } from './dto/create-bill-type.dto';

@Controller('bill-types')
export class BillTypesController {
    constructor(private billTypesService: BillTypesService) {}

    @Post()
    create(@Body() dto: CreateBillTypeDto) {
        return this.billTypesService.create(dto);
    }

    @Get()  // ← add this
    findAll() {
        return this.billTypesService.findAll();
    }

    @Get('household/:householdId')
    findByHousehold(@Param('householdId') householdId: string) {
        return this.billTypesService.findByHousehold(householdId);
    }
}