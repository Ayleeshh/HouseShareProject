// Import decorators from NestJS Mongoose library
// @Prop = marks a class property as a MongoDB field
// @Schema = marks the class as a MongoDB schema
// SchemaFactory = used at the bottom to convert the class into an actual Mongoose schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
