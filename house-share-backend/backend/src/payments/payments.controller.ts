import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get('bill/:billId')
  findByBill(@Param('billId') billId: string) {
    return this.paymentsService.findByBill(billId);
  }

  @Get('allocation/:allocationId')
  findByAllocation(@Param('allocationId') allocationId: string) {
    return this.paymentsService.findByAllocation(allocationId);
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.paymentsService.findByMember(memberId);
  }

}
