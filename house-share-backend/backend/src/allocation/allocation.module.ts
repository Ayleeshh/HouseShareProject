import { Module } from '@nestjs/common';
import { AllocationService } from './allocation.service';
import { AllocationController } from './allocation.controller';
import {Allocation, AllocationSchema} from "./schemas/allocation.schema";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Allocation.name, schema: AllocationSchema },
    ]),
  ],
  providers: [AllocationService],
  exports: [AllocationService],
})
export class AllocationsModule {}