import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillType, BillTypeSchema } from './schemas/bill-type.schema';
import { BillTypesController } from './bill-types.controller';
import { BillTypesService } from './bill-types.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BillType.name, schema: BillTypeSchema },
        ]),
    ],
    controllers: [BillTypesController],
    providers: [BillTypesService],
    exports: [BillTypesService],
})
export class BillTypesModule {}