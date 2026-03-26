import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'Bill', required: true })
    billId: Types.ObjectId;

    @Prop({ required: true })
    payerName: string;

    @Prop({ required: true, min: 0 })
    amountCents: number;

    @Prop({ default: Date.now })
    paidAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);