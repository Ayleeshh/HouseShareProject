import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    // POST /payments
    @Post()
    create(@Body() dto: CreatePaymentDto) {
        return this.paymentsService.create(dto);
    }

    // GET /payments/bill/:billId
    @Get('bill/:billId')
    findByBill(@Param('billId') billId: string) {
        return this.paymentsService.findByBill(billId);
    }
}