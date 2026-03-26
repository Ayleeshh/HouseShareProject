import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BillDocument = HydratedDocument<Bill>;

@Schema({ timestamps: true })
export class Bill {
    @Prop({ required: true })
    householdId: string;

    @Prop({ required: true })
    billType: string;

    @Prop({ required: true, min: 0 })
    totalCents: number;

    @Prop({ required: true })
    periodStart: Date;

    @Prop({ required: true })
    periodEnd: Date;

    @Prop({ default: 'open' })
    status: 'open' | 'paid';
}

export const BillSchema = SchemaFactory.createForClass(Bill);