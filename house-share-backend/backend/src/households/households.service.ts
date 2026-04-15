import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Household, HouseholdDocument } from './schemas/household.schema';
import {UpdateHouseholdDto} from "./dto/update-household.dto";

@Injectable()
export class HouseholdsService {
    constructor(
        // Injects the Household MongoDB model so we can query the household collection
        @InjectModel(Household.name)
        private householdModel: Model<HouseholdDocument>,
    ) {}

    // Creates new household in MongoDB
    async create(name: string) {
        return this.householdModel.create({ name });
    }

    // Returns all households
    async findAll() {
        return this.householdModel.find();
    }

    // Updates household
    async update(id: string, dto: UpdateHouseholdDto) {
        return this.householdModel.findByIdAndUpdate(id, dto, { new: true });
    }

    // Deletes household
    async delete(id: string) {
        return this.householdModel.findByIdAndDelete(id);
    }
}
