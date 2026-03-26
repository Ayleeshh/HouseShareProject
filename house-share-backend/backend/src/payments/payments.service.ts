import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { AllocationService } from '../allocation/allocation.service';
import { AllocationStatus } from '../allocation/schemas/allocation.schema';
import {CreatePaymentDto} from "./dto/create-payment.dto";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        private allocationService: AllocationService,
    ) {}

    async addPayment(dto: CreatePaymentDto) {
        const allocation = await this.allocationService.findById(dto.allocationId);
        if (!allocation) throw new BadRequestException('Allocation not found');

        // Rule 3: Cannot pay more than owed
        if (dto.amount > allocation.amountOutstanding) {
            throw new BadRequestException(
                `Payment exceeds outstanding amount: ${allocation.amountOutstanding}`
            );
        }

        // Save payment record
        const payment = new this.paymentModel(dto);
        await payment.save();

        // Update allocation
        const newPaid = +(allocation.amountPaid + dto.amount).toFixed(2);
        const newOutstanding = +(allocation.amountOwed - newPaid).toFixed(2);

        let newStatus: AllocationStatus;
        if (newPaid === 0) newStatus = AllocationStatus.UNPAID;
        else if (newPaid >= allocation.amountOwed) newStatus = AllocationStatus.PAID;
        else newStatus = AllocationStatus.PART_PAID;

        await this.allocationService.updatePayment(allocation._id, {
            amountPaid: newPaid,
            amountOutstanding: newOutstanding,
            status: newStatus,
        });

        await this.allocationService.checkAndCloseBill(allocation.billId);

        return payment;
    }
}
