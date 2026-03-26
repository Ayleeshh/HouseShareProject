import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bill, BillDocument } from './schemas/bill.schema';
import { AllocationService } from '../allocation/allocation.service';
import { MembersService } from '../members/members.service';
import {CreateBillDto} from "./dto/create-bill.dto";

@Injectable()
export class BillsService {
    constructor(
        @InjectModel(Bill.name) private billModel: Model<BillDocument>,
        private allocationService: AllocationService,
        private membersService: MembersService,
    ) {}

    async create(createBillDto: CreateBillDto): Promise<Bill> {
        const bill = new this.billModel(createBillDto);
        await bill.save();

        // Fetch active members for this household
        const members = await this.membersService.findActiveByHousehold(
            createBillDto.householdId
        );
        if (!members.length) throw new BadRequestException('No active members');

        // Equal split with rounding correction on last member
        const count = members.length;
        const base = Math.floor((createBillDto.totalAmount / count) * 100) / 100;
        const remainder = +(createBillDto.totalAmount - base * count).toFixed(2);

        for (let i = 0; i < members.length; i++) {
            const owed = i === members.length - 1 ? base + remainder : base;
            await this.allocationService.create({
                billId: bill._id,
                memberId: members[i]._id,
                householdId: createBillDto.householdId,
                amountOwed: owed,
                amountPaid: 0,
                amountOutstanding: owed,
            });
        }
        return bill;
    }

    async findByHousehold(householdId: string): Promise<Bill[]> {
        return this.billModel
            .find({ householdId })
            .populate('billTypeId')
            .populate('createdBy')
            .exec();
    }
}
