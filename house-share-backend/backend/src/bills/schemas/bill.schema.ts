import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema({ timestamps: true })
export class Bill {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Household', required: true })
    householdId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'BillType', required: true })
    billTypeId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
    createdBy: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true })
    periodStart: Date;

    @Prop({ required: true })
    periodEnd: Date;

    @Prop({ default: false })
    isFullyPaid: boolean;

    @Prop({ default: '' })
    notes: string;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
