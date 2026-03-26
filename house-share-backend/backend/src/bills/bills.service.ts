import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bill, BillDocument } from './schemas/bill.schema';
import { CreateBillDto } from './dto/create-bill.dto';

@Injectable()
export class BillsService {
    constructor(
        @InjectModel(Bill.name)
        private billModel: Model<BillDocument>,
    ) {}

    async create(dto: CreateBillDto) {
        return this.billModel.create({
            ...dto,
            periodStart: new Date(dto.periodStart),
            periodEnd: new Date(dto.periodEnd),
        });
    }

    async findAllByHousehold(householdId: string) {
        return this.billModel
            .find({ householdId })
            .sort({ periodStart: -1 })
            .exec();
    }

    async findOne(id: string) {
        const bill = await this.billModel.findById(id).exec();

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        return bill;
    }

    async markPaid(id: string) {
        const bill = await this.billModel
            .findByIdAndUpdate(
                id,
                { status: 'paid' },
                { new: true },
            )
            .exec();

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        return bill;
    }
}