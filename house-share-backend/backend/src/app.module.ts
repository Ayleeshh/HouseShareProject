import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsModule } from './bills/bills.module';
import { PaymentsModule } from './payments/payments.module';
import { HouseholdsModule } from './households/households.module';
import { MembersModule } from './members/members.module';
import { BillTypesController } from './bill-types/bill-types.controller';
import { AllocationModule } from './allocation/allocation.module';
import { BillTypesModule } from './bill-types/bill-types.module';
import { BillTypesService } from './bill-types/bill-types.service';
import { BillTypesController } from './bill-types/bill-types.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGO_URI'),
            }),
        }),

        BillsModule,

        PaymentsModule,

        HouseholdsModule,

        MembersModule,

        BillTypesModule,

        AllocationModule,
    ],
    controllers: [BillTypesController],
    providers: [BillTypesService],
})
export class AppModule {}