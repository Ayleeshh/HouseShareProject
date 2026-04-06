import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
    constructor(

        // Injects the Member MongoDB model so we can query the members collection
        @InjectModel(Member.name)
        private memberModel: Model<MemberDocument>,
    ) {}

    // Creates new member in MongoDB
    async create(dto: CreateMemberDto) {
        return this.memberModel.create(dto);
    }

    // Returns all members
    async findAll() {
        return this.memberModel.find();
    }

    // Returns all members to a specific household
    async findByHousehold(householdId: string) {
        return this.memberModel.find({ householdId });
    }

    // Updates member by id
    // Partial means not all forms have to be inputted
    async update(id: string, dto: Partial<CreateMemberDto>) {
        return this.memberModel.findByIdAndUpdate(id, dto, { new: true });
    }

    // Deletes member
    async delete(id: string) {
        return this.memberModel.findByIdAndDelete(id);
    }

}
