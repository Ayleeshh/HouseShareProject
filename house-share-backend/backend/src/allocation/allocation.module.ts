import { Module } from '@nestjs/common';
import { AllocationService } from './allocation.service';
import { AllocationController } from './allocation.controller';
import { Allocation, AllocationSchema } from './schemas/allocation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {Bill, BillSchema} from "../bills/schemas/bill.schema";

@Module({
  imports: [
    // Registers Allocation and Bill schemas with MongoDB for use in this module
    MongooseModule.forFeature([
      { name: Allocation.name, schema: AllocationSchema },
      { name: Bill.name, schema: BillSchema }
    ]),
  ],
  // Registers the controller that handles incoming requests
  controllers: [AllocationController],

  // Registers the service that contains the business logic
  providers: [AllocationService],

  // Exports the service so other modules can use it
  exports: [AllocationService],
})
export class AllocationsModule {}