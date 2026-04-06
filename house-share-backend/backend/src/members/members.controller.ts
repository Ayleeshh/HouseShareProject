import {Controller, Post, Get, Body, Param, Patch, Delete} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';

// All routes start with 'members'
@Controller('members')
export class MembersController {
    // Injects service so the methods can be called
    constructor(private membersService: MembersService) {}

    // Creates a member using data from html
    @Post()
    create(@Body() dto: CreateMemberDto) {
        return this.membersService.create(dto);
    }

    // Returns all members
    @Get()
    findAll() {
        return this.membersService.findAll();
    }

    // Returns members within a household
    @Get('household/:householdId')
    findByHousehold(@Param('householdId') householdId: string) {
        return this.membersService.findByHousehold(householdId);
    }

    // Updates member using id
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateMemberDto>) {
        return this.membersService.update(id, dto);
    }

    // Deletes a member
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.membersService.delete(id);
    }
}
