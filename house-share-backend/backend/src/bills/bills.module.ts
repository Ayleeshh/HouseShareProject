import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill, BillSchema } from './schemas/bill.schema';
import { AllocationsModule } from '../allocation/allocation.module';
import {MembersModule} from "../members/members.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
    ]),
    AllocationsModule,
    MembersModule,
  ],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}
