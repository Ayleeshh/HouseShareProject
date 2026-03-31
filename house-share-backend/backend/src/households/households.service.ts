import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Household, HouseholdDocument } from './schemas/household.schema';
import {UpdateHouseholdDto} from "./dto/update-household.dto";

@Injectable()
export class HouseholdsService {
    constructor(
        @InjectModel(Household.name)
        private householdModel: Model<HouseholdDocument>,
    ) {}
    async create(name: string) {
        return this.householdModel.create({ name });
    }

    async findAll() {
        return this.householdModel.find();
    }

    async update(id: string, dto: UpdateHouseholdDto) {
        return this.householdModel.findByIdAndUpdate(id, dto, { new: true });
    }

    async delete(id: string) {
        return this.householdModel.findByIdAndDelete(id);
    }
}
