import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillTypeDocument = BillType & Document;

@Schema()
export class BillType {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    householdId: string;
}

export const BillTypeSchema = SchemaFactory.createForClass(BillType);