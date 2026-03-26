import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BillTypeDocument = BillType & Document;

@Schema({ timestamps: true })
export class BillType {
    @Prop({ required: true })
    name: string;  // e.g. 'Electricity', 'Internet', 'Bins'

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Household', required: true })
    householdId: MongooseSchema.Types.ObjectId;
}

export const BillTypeSchema = SchemaFactory.createForClass(BillType);
