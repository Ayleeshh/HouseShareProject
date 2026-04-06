import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Allocation, AllocationDocument } from './schemas/allocation.schema';
import { Model } from 'mongoose';
import { Bill, BillDocument } from '../bills/schemas/bill.schema';

@Injectable()
export class AllocationService {
    constructor(
        // Injects the Allocation MongoDB model so can query the allocations collection
        @InjectModel(Allocation.name)
        private allocationModel: Model<AllocationDocument>,

        // Injects the Bill MongoDB model so can update a bill's isClosed field
        @InjectModel(Bill.name)
        private billModel: Model<BillDocument>,
    ) {}

    // Creates new allocation in MongoDB
    async create(dto: Partial<Allocation>) {
        return this.allocationModel.create(dto);
    }

    // Finds all allocations for a bill
    async findByBill(billId: string) {
        return this.allocationModel.find({ billId });
    }

    // Finds an allocation using id
    async findById(id: string) {
        return this.allocationModel.findById(id);
    }

    // Updates an allocation after payment is recorded
    async updatePayment(id: string, update: Partial<Allocation>) {
        return this.allocationModel.findByIdAndUpdate(id, update, { new: true });
    }

    // Checks if every allocation for a bill is paid and marks the bill as closed
    async checkAndCloseBill(billId: string) {
        const allocations = await this.allocationModel.find({ billId });
        // .every() returns true only if all allocations have status = paid
        const allPaid = allocations.every(a => a.status === 'paid');

        if (allPaid) {
            await this.billModel.findByIdAndUpdate(billId, { isClosed: true });
        }
    }

    // Finds all allocations assigned to a specific member
    async findByMember(memberId: string) {
        return this.allocationModel.find({ memberId });
    }
}