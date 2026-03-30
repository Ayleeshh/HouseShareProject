import {Body, Controller, Get, Post} from '@nestjs/common';
import { HouseholdsService } from './households.service';

@Controller('households')
export class HouseholdsController {
    constructor(private householdsService: HouseholdsService) {}
    @Post()
    create(@Body('name') name: string) {
        return this.householdsService.create(name);
    }

    @Get()
    findAll() {
        return this.householdsService.findAll();
    }
}
