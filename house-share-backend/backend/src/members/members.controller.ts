import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @Post()
    create(@Body() dto: CreateMemberDto) {
        return this.membersService.create(dto);
    }

    @Get()  // ← add this
    findAll() {
        return this.membersService.findAll();
    }

    @Get('household/:householdId')
    findByHousehold(@Param('householdId') householdId: string) {
        return this.membersService.findByHousehold(householdId);
    }
}
