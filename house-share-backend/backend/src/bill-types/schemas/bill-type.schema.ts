// Import decorators from NestJS Mongoose library
// @Prop = marks a class property as a MongoDB field
// @Schema = marks the class as a MongoDB schema
// SchemaFactory = used at the bottom to convert the class into an actual Mongoose schema
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