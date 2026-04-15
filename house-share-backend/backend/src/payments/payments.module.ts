import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { AllocationsModule } from '../allocation/allocation.module';

@Module({
  imports: [
    // Registers Payment schemas with MongoDB for use in this module
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
    ]),
    // Gives this module access to AllocationService
    AllocationsModule,
  ],
  // Registers the controller that handles incoming requests
  controllers: [PaymentsController],

  // Registers the service that contains the business logic
  providers: [PaymentsService],
})
export class PaymentsModule {}