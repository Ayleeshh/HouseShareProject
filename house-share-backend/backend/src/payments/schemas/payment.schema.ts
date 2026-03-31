import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ required: true })
    allocationId: string;

    @Prop({ required: true })
    memberId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: Date.now })
    paidAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
