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