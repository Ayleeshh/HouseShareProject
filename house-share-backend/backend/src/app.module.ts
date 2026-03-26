import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsModule } from './bills/bills.module';
import { PaymentsModule } from './payments/payments.module';

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
    ],
})
export class AppModule {}