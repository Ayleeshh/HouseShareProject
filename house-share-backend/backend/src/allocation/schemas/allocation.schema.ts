// Import decorators from NestJS Mongoose library
// @Prop = marks a class property as a MongoDB field
// @Schema = marks the class as a MongoDB schema
// SchemaFactory = used at the bottom to convert the class into an actual Mongoose schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';

export type AllocationDocument = Allocation & Document;

// Marks class as MongoDB Schema, auto-adds createdAt & updatedAt
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

// Converts the class into a real Mongoose schema MongoDB can use
export const AllocationSchema = SchemaFactory.createForClass(Allocation);
