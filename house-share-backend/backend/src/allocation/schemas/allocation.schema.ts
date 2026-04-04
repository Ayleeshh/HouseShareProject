import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AllocationDocument = Allocation & Document;

@Schema({ timestamps: true })
export class Allocation {
  @Prop({required: true})
  billId: string;

  @Prop({required: true})
  memberId: string;

  @Prop({required: true})
  amountOwed: number;

  @Prop({ default: 0 })
  amountPaid: number;

  @Prop({ default: 'unpaid'})
  status: string;
}

export const AllocationSchema = SchemaFactory.createForClass(Allocation);
