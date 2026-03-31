import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Allocation, AllocationDocument } from './schemas/allocation.schema';
import { Model } from 'mongoose';
import { Bill, BillDocument } from '../bills/schemas/bill.schema';

@Injectable()
export class AllocationService {
    constructor(
        @InjectModel(Allocation.name)
        private allocationModel: Model<AllocationDocument>,

        @InjectModel(Bill.name)           // ← inject Bill model directly
        private billModel: Model<BillDocument>,
    ) {}

    async create(dto: Partial<Allocation>) {
        return this.allocationModel.create(dto);
    }

    async findByBill(billId: string) {
        return this.allocationModel.find({ billId });
    }

    async findById(id: string) {
        return this.allocationModel.findById(id);
    }

    async updatePayment(id: string, update: Partial<Allocation>) {
        return this.allocationModel.findByIdAndUpdate(id, update, { new: true });
    }

    async checkAndCloseBill(billId: string) {
        const allocations = await this.allocationModel.find({ billId });
        const allPaid = allocations.every(a => a.status === 'paid');

        if (allPaid) {
            await this.billModel.findByIdAndUpdate(billId, { isClosed: true });
        }
    }
}