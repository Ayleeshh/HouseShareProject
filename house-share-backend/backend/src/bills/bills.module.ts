import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill, BillSchema } from './schemas/bill.schema';
import { AllocationModule } from '../allocation/allocation.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
        AllocationModule,
    ],
    controllers: [BillsController],
    providers: [BillsService],
    exports: [BillsService],
})
export class BillsModule {}
