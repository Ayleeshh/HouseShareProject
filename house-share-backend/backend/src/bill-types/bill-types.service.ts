import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillType, BillTypeDocument } from './schemas/bill-type.schema';
import { CreateBillTypeDto } from './dto/create-bill-type.dto';
import {CreateMemberDto} from "../members/dto/create-member.dto";

@Injectable()
export class BillTypesService {
    constructor(
        @InjectModel(BillType.name) private billTypeModel: Model<BillTypeDocument>,
    ) {}

    async create(dto: CreateBillTypeDto) {
        return this.billTypeModel.create(dto);
    }

    async findAll() {
        return this.billTypeModel.find();
    }

    async findByHousehold(householdId: string) {
        return this.billTypeModel.find({ householdId });
    }

    async update(id: string, dto: Partial<CreateMemberDto>) {
        return this.billTypeModel.findByIdAndUpdate(id, dto, { new: true });
    }

    async delete(id: string) {
        return this.billTypeModel.findByIdAndDelete(id);
    }
}