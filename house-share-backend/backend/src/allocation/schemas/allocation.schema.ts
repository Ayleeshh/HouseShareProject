import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AllocationDocument = Allocation & Document;

export enum AllocationStatus { UNPAID = 'unpaid', PART_PAID = 'part-paid', PAID = 'paid' }

@Schema({ timestamps: true })
export class Allocation {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bill', required: true })
    billId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
    memberId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Household', required: true })
    householdId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    amountOwed: number;

    @Prop({ default: 0 })
    amountPaid: number;

    @Prop({ default: 0 })
    amountOutstanding: number;

    @Prop({ enum: AllocationStatus, default: AllocationStatus.UNPAID })
    status: AllocationStatus;
}

export const AllocationSchema = SchemaFactory.createForClass(Allocation);
