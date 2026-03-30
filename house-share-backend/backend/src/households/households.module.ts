import { MongooseModule } from '@nestjs/mongoose';
import { Household, HouseholdSchema } from './schemas/household.schema';
import {HouseholdsService} from "./households.service";
import {Module} from "@nestjs/common";
import {HouseholdsController} from "./households.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Household.name, schema: HouseholdSchema },
        ]),
    ],
    controllers: [HouseholdsController],
    providers: [HouseholdsService],
})
export class HouseholdsModule {}