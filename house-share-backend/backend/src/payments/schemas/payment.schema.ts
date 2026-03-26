import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Allocation', required: true })
    allocationId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
    memberId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bill', required: true })
    billId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: Date.now })
    paidAt: Date;

    @Prop({ default: '' })
    note: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
