import { MongooseModule } from '@nestjs/mongoose';
import { Household, HouseholdSchema } from './schemas/household.schema';
import {HouseholdsService} from "./households.service";
import {Module} from "@nestjs/common";
import {HouseholdsController} from "./households.controller";

@Module({
    imports: [
        // Registers Household schemas with MongoDB for use in this module
        MongooseModule.forFeature([
            { name: Household.name, schema: HouseholdSchema },
        ]),
    ],
    // Registers the controller that handles incoming requests
    controllers: [HouseholdsController],

    // Registers the service that contains the business logic
    providers: [HouseholdsService],
})
export class HouseholdsModule {}