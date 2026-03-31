import {Controller, Post, Get, Body, Param, Patch, Delete} from '@nestjs/common';
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

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateMemberDto>) {
        return this.membersService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.membersService.delete(id);
    }
}
