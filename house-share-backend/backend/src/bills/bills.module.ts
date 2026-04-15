import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill, BillSchema } from './schemas/bill.schema';
import { AllocationsModule } from '../allocation/allocation.module';
import {MembersModule} from "../members/members.module";

@Module({
  imports: [
    // Registers Bill schemas with MongoDB for use in this module
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
    ]),
    // Gives this module access to AllocationService
    AllocationsModule,
    // Gives this module access to MembersService
    MembersModule,
  ],
  // Registers the controller that handles incoming requests
  controllers: [BillsController],

  // Registers the service that contains the business logic
  providers: [BillsService],
})
export class BillsModule {}
