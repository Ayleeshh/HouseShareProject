import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
    constructor(
        @InjectModel(Member.name)
        private memberModel: Model<MemberDocument>,
    ) {}

    async create(dto: CreateMemberDto) {
        return this.memberModel.create(dto);
    }

    async findAll() {
        return this.memberModel.find();
    }

    async findByHousehold(householdId: string) {
        return this.memberModel.find({ householdId });
    }

    async findActiveByHousehold(householdId: string) {
        return this.memberModel.find({ householdId, isActive: true });
    }

    async update(id: string, dto: Partial<CreateMemberDto>) {
        return this.memberModel.findByIdAndUpdate(id, dto, { new: true });
    }

    async delete(id: string) {
        return this.memberModel.findByIdAndDelete(id);
    }

}
