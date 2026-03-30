import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Household, HouseholdDocument } from './schemas/household.schema';

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
}
