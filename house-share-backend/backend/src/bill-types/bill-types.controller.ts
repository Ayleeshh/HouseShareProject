import {Controller, Post, Get, Body, Param, Patch, Delete} from '@nestjs/common';
import { BillTypesService } from './bill-types.service';
import { CreateBillTypeDto } from './dto/create-bill-type.dto';
import {CreateMemberDto} from "../members/dto/create-member.dto";

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

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateMemberDto>) {
        return this.billTypesService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.billTypesService.delete(id);
    }
}