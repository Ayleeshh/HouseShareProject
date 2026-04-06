import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import { HouseholdsService } from './households.service';
import {CreateHouseholdDto} from "./dto/create-household.dto";
import {UpdateHouseholdDto} from "./dto/update-household.dto";

// All routes start with 'households'
@Controller('households')
export class HouseholdsController {
    // Injects service so the methods can be called
    constructor(private householdsService: HouseholdsService) {}

    // Creates a household using data from html
    @Post()
    create(@Body() dto: CreateHouseholdDto) {
        return this.householdsService.create(dto.name);
    }

    // Returns all households
    @Get()
    findAll() {
        return this.householdsService.findAll();
    }

    // Updates a household using id
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateHouseholdDto) {
        return this.householdsService.update(id, dto);
    }

    // Deletes a household
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.householdsService.delete(id);
    }
}
