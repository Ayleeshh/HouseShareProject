import { Controller, Get, Param } from '@nestjs/common';
import { AllocationService } from './allocation.service';

@Controller('allocations')
export class AllocationController {
    constructor(private allocationService: AllocationService) {}

    @Get('bill/:billId')
    findByBill(@Param('billId') billId: string) {
        return this.allocationService.findByBill(billId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.allocationService.findById(id);
    }
}