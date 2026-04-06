import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillType, BillTypeSchema } from './schemas/bill-type.schema';
import { BillTypesController } from './bill-types.controller';
import { BillTypesService } from './bill-types.service';

@Module({
    imports: [
        // Registers BillType schemas with MongoDB for use in this module
        MongooseModule.forFeature([
            { name: BillType.name, schema: BillTypeSchema },
        ]),
    ],
    // Registers the controller that handles incoming requests
    controllers: [BillTypesController],

    // Registers the service that contains the business logic
    providers: [BillTypesService],

    // Exports the service so other modules can use it
    exports: [BillTypesService],
})
export class BillTypesModule {}