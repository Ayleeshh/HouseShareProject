import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import { HouseholdsService } from './households.service';
import {CreateHouseholdDto} from "./dto/create-household.dto";
import {UpdateHouseholdDto} from "./dto/update-household.dto";

@Controller('households')
export class HouseholdsController {
    constructor(private householdsService: HouseholdsService) {}
    @Post()
    create(@Body() dto: CreateHouseholdDto) {
        return this.householdsService.create(dto.name);
    }

    @Get()
    findAll() {
        return this.householdsService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateHouseholdDto) {
        return this.householdsService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.householdsService.delete(id);
    }
}
