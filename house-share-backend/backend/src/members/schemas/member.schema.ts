import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema()
export class Member {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Household', required: true })
    householdId: MongooseSchema.Types.ObjectId;

    @Prop({ default: false })
    isAdmin: boolean;

    @Prop({ default: true })
    isActive: boolean;

}
export const MemberSchema = SchemaFactory.createForClass(Member);