import {Controller, Post, Get, Body, Param, Patch, Delete} from '@nestjs/common';
import { BillTypesService } from './bill-types.service';
import { CreateBillTypeDto } from './dto/create-bill-type.dto';
import {CreateMemberDto} from "../members/dto/create-member.dto";

// All routes start with 'bill-types'
@Controller('bill-types')
export class BillTypesController {
    // Injects service so the methods can be called
    constructor(private billTypesService: BillTypesService) {}

    // Creates new bill type using data from html
    @Post()
    create(@Body() dto: CreateBillTypeDto) {
        return this.billTypesService.create(dto);
    }

    // Returns all bill types
    @Get()
    findAll() {
        return this.billTypesService.findAll();
    }

    // Returns all bill types by household id
    @Get('household/:householdId')
    findByHousehold(@Param('householdId') householdId: string) {
        return this.billTypesService.findByHousehold(householdId);
    }

    // Updates a bill type by id
    // Partial =  all fields are not required
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateMemberDto>) {
        return this.billTypesService.update(id, dto);
    }

    // Deletes a bill type by id
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.billTypesService.delete(id);
    }
}