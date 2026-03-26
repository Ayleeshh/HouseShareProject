import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HouseholdsService } from './households.service';
import { HouseholdsController } from './households.controller';
import {Household, HouseholdSchema} from "./schemas/household.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Household.name, schema: HouseholdSchema }
        ]),
    ],
  providers: [HouseholdsService],
  controllers: [HouseholdsController]
})
export class HouseholdsModule {}
