import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillType, BillTypeDocument } from './schemas/bill-type.schema';
import { CreateBillTypeDto } from './dto/create-bill-type.dto';
import {CreateMemberDto} from "../members/dto/create-member.dto";

@Injectable()
export class BillTypesService {
    constructor(
        // Injects the BillType MongoDB model so can query the bill type collection
        @InjectModel(BillType.name)
        private billTypeModel: Model<BillTypeDocument>,
    ) {}

    // Creates new bill type in MongoDB
    async create(dto: CreateBillTypeDto) {
        return this.billTypeModel.create(dto);
    }

    // Finds all bill types
    async findAll() {
        return this.billTypeModel.find();
    }

    // Finds all bill types by household id
    async findByHousehold(householdId: string) {
        return this.billTypeModel.find({ householdId });
    }

    // Finds a bill type by ID and updates it
    async update(id: string, dto: Partial<CreateMemberDto>) {
        return this.billTypeModel.findByIdAndUpdate(id, dto, { new: true });
    }

    // Finds a bill type by ID and deletes it from MongoDB
    async delete(id: string) {
        return this.billTypeModel.findByIdAndDelete(id);
    }
}