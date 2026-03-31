import { Module } from '@nestjs/common';
import { AllocationService } from './allocation.service';
import { AllocationController } from './allocation.controller';
import { Allocation, AllocationSchema } from './schemas/allocation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {Bill, BillSchema} from "../bills/schemas/bill.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Allocation.name, schema: AllocationSchema },
      { name: Bill.name, schema: BillSchema }
    ]),
  ],
  controllers: [AllocationController],
  providers: [AllocationService],
  exports: [AllocationService],
})
export class AllocationsModule {}