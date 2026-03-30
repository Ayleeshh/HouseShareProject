import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bill, BillDocument } from './schemas/bill.schema';
import { AllocationService } from '../allocation/allocation.service';
import { MembersService } from '../members/members.service';
import { CreateBillDto } from './dto/create-bill.dto';

@Injectable()
export class BillsService {
  constructor(
      @InjectModel(Bill.name)
      private billModel: Model<BillDocument>,
      private allocationService: AllocationService,
      private membersService: MembersService,
  ) {}

  async create(dto: CreateBillDto) {
    const bill = await this.billModel.create(dto);

    const members = await this.membersService.findActiveByHousehold(
        dto.householdId,
    );

    const count = members.length;

    const base = Math.floor((dto.totalAmount / count) * 100) / 100;
    const remainder = +(dto.totalAmount - base * count).toFixed(2);

    for (let i = 0; i < members.length; i++) {
      const extra = i === 0 ? remainder : 0;

      await this.allocationService.create({
        billId: bill._id.toString(),
        memberId: members[i]._id.toString(),
        amountOwed: base + extra,
        amountPaid: 0,
      });
    }

    return bill;
  }

  async findByHousehold(householdId: string) {
    return this.billModel.find({ householdId });
  }

  async findOne(id: string) {
    return this.billModel.findById(id);
  }

}