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
      // Injects the Bill MongoDB model so we can query the bills collection
      @InjectModel(Bill.name)
      private billModel: Model<BillDocument>,

      // Injects AllocationService to create per-member allocations after bill is saved
      private allocationService: AllocationService,

      // Injects MembersService to fetch all members in the household
      private membersService: MembersService,
  ) {}

  async create(dto: CreateBillDto) {

    // Saves new bill to MongoDB
    const bill = await this.billModel.create(dto);

    // Fetches all members in household for splitting bills
    const members = await this.membersService.findByHousehold(
        dto.householdId,
    );

    // Total no. of members to split between
    const count = members.length;

    // Calculates each members share (rounded to 2 places)
    const base = Math.floor((dto.totalAmount / count) * 100) / 100;

    // Calculates leftover cents after rounding
    const remainder = +(dto.totalAmount - base * count).toFixed(2);

    // Creates 1 allocation per member
    for (let i = 0; i < members.length; i++) {

      // Adds the remainder to the first member only, so the total always adds up exactly
      const extra = i === 0 ? remainder : 0;

      await this.allocationService.create({
        billId: bill._id.toString(),
        memberId: members[i]._id.toString(),
        // First member gets base + remainder, everyone else just gets base
        amountOwed: base + extra,
        amountPaid: 0,
      });
    }

    return bill;
  }

  // Returns all bills for household
  async findByHousehold(householdId: string) {
    return this.billModel.find({ householdId });
  }

  // Returns specific bill
  async findOne(id: string) {
    return this.billModel.findById(id);
  }

  // Deletes the bill
  async delete(id: string) {
    return this.billModel.findByIdAndDelete(id);
  }



}