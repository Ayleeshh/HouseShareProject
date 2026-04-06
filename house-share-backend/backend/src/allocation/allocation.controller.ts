import { Controller, Get, Param } from '@nestjs/common';
import { AllocationService } from './allocation.service';

// All routes start with 'allocations'
@Controller('allocations')
export class AllocationController {

    // Injects service so the methods can be called
    constructor(private allocationService: AllocationService) {}

    // Fetches all allocations for specific bill
    @Get('bill/:billId')
    findByBill(@Param('billId') billId: string) {
        return this.allocationService.findByBill(billId);
    }

    // Fetch a single allocation by ID
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.allocationService.findById(id);
    }

    // Fetch all allocations for specific member
    @Get('member/:memberId')
    findByMember(@Param('memberId') memberId: string) {
        return this.allocationService.findByMember(memberId);
    }
}