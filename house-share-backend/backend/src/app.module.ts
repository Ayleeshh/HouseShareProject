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
    // Loads .env  and makes them available
    ConfigModule.forRoot({ isGlobal: true }),

    // Connects to MongoDB using the MONGO_URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    // Registers all feature modules with the app
    BillsModule,
    PaymentsModule,
    HouseholdsModule,
    MembersModule,
    BillTypesModule,
    AllocationsModule,
  ],

})
export class AppModule {}