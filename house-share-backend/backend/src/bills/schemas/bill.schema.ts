import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {IsDateString} from "class-validator";

export type BillDocument = Bill & Document;

@Schema({ timestamps: true })
export class Bill {
    @Prop({required: true })
    householdId: string;

    @Prop({required: true })
    billTypeId: string;

    @Prop({ required: true })
    description: string;

    @Prop({required: true })
    totalAmount: number;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ default: false })
    isClosed: boolean;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
