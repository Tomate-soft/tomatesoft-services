import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Departament } from './departament';
import { Role } from './role.schema';

const { ObjectId } = MongooseSchema.Types;

@Schema({ timestamps: true })
export class Profile {
  @Prop({
    type: [{ type: ObjectId, ref: 'Departament' }],
  })
  departament: Departament[];

  @Prop({
    trim: true,
  })
  code?: number;

  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  profileName: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Role',
    default: null,
  })
  role: Role;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
