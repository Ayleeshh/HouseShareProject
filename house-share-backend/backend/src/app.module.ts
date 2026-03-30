import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsModule } from './bills/bills.module';
import { PaymentsModule } from './payments/payments.module';
import { HouseholdsModule } from './households/households.module';
import { MembersModule } from './members/members.module';
import { BillTypesModule } from './bill-types/bill-types.module';
import { AllocationsModule } from './allocation/allocation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
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
    AllocationsModule,
  ],

})
export class AppModule {}