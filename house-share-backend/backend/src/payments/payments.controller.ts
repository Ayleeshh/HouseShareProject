import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

// All routes start with 'payments'
@Controller('payments')
export class PaymentsController {
  // Injects service so the methods can be called
  constructor(private readonly paymentsService: PaymentsService) {}

  // Creates a payment using data from html
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  // Returns all payments for specific bill
  @Get('bill/:billId')
  findByBill(@Param('billId') billId: string) {
    return this.paymentsService.findByBill(billId);
  }

  // Returns all for a specific allocation
  @Get('allocation/:allocationId')
  findByAllocation(@Param('allocationId') allocationId: string) {
    return this.paymentsService.findByAllocation(allocationId);
  }

  // Returns all for a specific member
  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.paymentsService.findByMember(memberId);
  }

}
