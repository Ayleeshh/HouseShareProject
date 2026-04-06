// Import decorators from NestJS Mongoose library
// @Prop = marks a class property as a MongoDB field
// @Schema = marks the class as a MongoDB schema
// SchemaFactory = used at the bottom to convert the class into an actual Mongoose schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HouseholdDocument = Household & Document;

@Schema({
    timestamps: true
})
export class Household {
  @Prop({ required: true })
  name: string;

  @Prop({ default: [] })
  memberIds: string[];
}

export const HouseholdSchema = SchemaFactory.createForClass(Household);