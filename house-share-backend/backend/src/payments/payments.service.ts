import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { AllocationService } from '../allocation/allocation.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
@Injectable()
export class PaymentsService {
  constructor(
      @InjectModel(Payment.name)
      private paymentModel: Model<PaymentDocument>,
      private allocationService: AllocationService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const allocation = await this.allocationService.findById(dto.allocationId);

    if (!allocation) {
      throw new BadRequestException('Allocation not found');
    }
    if (dto.amount > allocation.amountOwed - allocation.amountPaid) {
      throw new BadRequestException('Overpayment not allowed');
    }

    const payment = await this.paymentModel.create(dto);

    const newPaid = allocation.amountPaid + dto.amount;

    await this.allocationService.updatePayment(allocation._id.toString(), {
      amountPaid: newPaid,
      status:
          newPaid >= allocation.amountOwed ? 'paid' : 'part-paid',
    });

    await this.allocationService.checkAndCloseBill(allocation.billId);

    return payment;
  }

  async findByBill(billId: string) {
    return this.paymentModel.find({ billId });
  }

  async findByAllocation(allocationId: string) {
    return this.paymentModel.find({ allocationId });
  }

  async findByMember(memberId: string) {
    return this.paymentModel.find({ memberId });
  }



}