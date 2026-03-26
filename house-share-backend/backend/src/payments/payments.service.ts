import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(Payment.name)
        private paymentModel: Model<PaymentDocument>,
    ) {}

    async create(dto: CreatePaymentDto) {
        return this.paymentModel.create({
            billId: new Types.ObjectId(dto.billId),
            payerName: dto.payerName,
            amountCents: dto.amountCents,
        });
    }

    async findByBill(billId: string) {
        return this.paymentModel
            .find({ billId: new Types.ObjectId(billId) })
            .sort({ paidAt: -1 })
            .exec();
    }
}