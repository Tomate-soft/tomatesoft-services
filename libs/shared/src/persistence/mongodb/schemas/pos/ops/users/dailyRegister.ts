import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '../../../users';

const { ObjectId } = MongooseSchema.Types;

@Schema({ versionKey: false, timestamps: true })
export class DailyRegister {
  @Prop({ required: true, type: ObjectId, ref: 'User' })
  userId: User;

  @Prop({ trim: true, default: null })
  firstTime?: string | null;

  @Prop({ trim: true, default: null })
  secondTime?: string | null;

  @Prop({ trim: true, default: null })
  thirdTime?: string | null;

  @Prop({ trim: true, default: null })
  fourthTime?: string | null;
}

export const DailyRegisterSchema = SchemaFactory.createForClass(DailyRegister);
