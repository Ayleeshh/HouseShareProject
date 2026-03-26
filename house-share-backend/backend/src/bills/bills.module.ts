import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { Bill, BillSchema } from './schemas/bill.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bill.name, schema: BillSchema },
            { name: Payment.name, schema: PaymentSchema },
        ]),
    ],
    controllers: [BillsController],
    providers: [BillsService],
})
export class BillsModule {}