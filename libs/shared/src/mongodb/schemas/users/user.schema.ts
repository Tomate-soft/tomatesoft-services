import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Profile } from './profile.schema';
import { Table } from '../pos/ops/tables/table.schema';
import { DailyRegister } from '../pos/ops/users/dailyRegister';
import { CashierSession } from '../pos/ops/till/cashier-session.schema';
import { ToGoOrder } from '../pos/ops/orders/togo-order.schema';
import { RappiOrder } from '../pos/ops/orders/rappi-order.schema';
import { PhoneOrder } from '../pos/ops/orders/phone-order.schema';

const { ObjectId } = MongooseSchema.Types;

export type saleTypeKey = 'RT' | 'TG' | 'RP' | 'PH';

export interface Transaction {
  paymentType: string;
  quantity: string;
  payQuantity: string;
  tips: string;
  type?: saleTypeKey;
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  password: string;

  @Prop({
    type: ObjectId,
    ref: 'Profile',
  })
  role?: Profile;

  @Prop({
    default: true,
  })
  active?: boolean;

  @Prop({
    trim: true,
  })
  employeeNumber?: number;

  @Prop({
    trim: true,
  })
  pinPos: number;

  @Prop({
    trim: true,
  })
  shift: string;

  @Prop({
    trim: true,
  })
  entryDate: string;

  @Prop({
    trim: true,
  })
  color: string;

  @Prop({
    required: false,
    default: [],
  })
  samples?: string[];

  @Prop({
    default: true,
  })
  pos: boolean;

  @Prop({
    default: false,
  })
  admin: boolean;

  @Prop({ type: Object, default: {} })
  authorizations?: {
    admin: {
      active: boolean;
      modules: Record<string, any>;
    };
    pos: {
      active: boolean;
      sellTypes: {
        restaurant: string[];
      };
    };
  };

  @Prop({
    type: [{ type: ObjectId, ref: 'Table' }],
    default: [],
  })
  tables: Table[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'DailyRegister',
    default: null,
  })
  dailyRegister?: DailyRegister;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'CashierSession',
    default: null,
  })
  cashierSession?: CashierSession;

  @Prop({ trim: true, default: [] })
  tips?: Transaction[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'ToGoOrder' }],
    default: [],
  })
  togoorders?: ToGoOrder[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'RappiOrder' }],
    default: [],
  })
  rappiOrders?: RappiOrder[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'PhoneOrder' }],
    default: [],
  })
  phoneOrders?: PhoneOrder[];
}

export const UserSchema = SchemaFactory.createForClass(User);
