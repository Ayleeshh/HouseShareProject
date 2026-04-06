import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { AllocationService } from '../allocation/allocation.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
@Injectable()
export class PaymentsService {
  constructor(

      // Injects the Payment MongoDB model so we can query the payments collection
      @InjectModel(Payment.name)
      private paymentModel: Model<PaymentDocument>,

      // Injects AllocationService to update the member's allocation after payment
      private allocationService: AllocationService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const allocation = await this.allocationService.findById(dto.allocationId);

    if (!allocation) {
      throw new BadRequestException('Allocation not found');
    }

    // Work in whole cents to avoid floating point issues entirely
    const owedCents = Math.round(allocation.amountOwed * 100);
    const paidCents = Math.round(allocation.amountPaid * 100);
    const paymentCents = Math.round(dto.amount * 100);
    const outstandingCents = owedCents - paidCents;

    if (paymentCents > outstandingCents) {
      throw new BadRequestException('Overpayment not allowed');
    }

    const payment = await this.paymentModel.create(dto);

    const newPaidCents = paidCents + paymentCents;

    await this.allocationService.updatePayment(allocation._id.toString(), {
      amountPaid: newPaidCents / 100,
      status: newPaidCents >= owedCents ? 'paid' : 'part-paid',
    });

    await this.allocationService.checkAndCloseBill(allocation.billId);

    return payment;
  }

  // Returns all payments made against a specific bill
  async findByBill(billId: string) {
    return this.paymentModel.find({ billId });
  }

  // Returns all payments made against a specific allocation
  async findByAllocation(allocationId: string) {
    return this.paymentModel.find({ allocationId });
  }

  // Returns all payments made by a specific member
  async findByMember(memberId: string) {
    return this.paymentModel.find({ memberId });
  }

}