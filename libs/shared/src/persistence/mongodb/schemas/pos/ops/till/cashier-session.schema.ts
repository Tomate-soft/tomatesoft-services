import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { OperatingPeriod, User } from '../../..';
import { Bills } from '../orders/bill.schema';
import { ToGoOrder } from '../orders/togo-order.schema';
import { RappiOrder } from '../orders/rappi-order.schema';
import { PhoneOrder } from '../orders/phone-order.schema';
import { CashWithdraw } from './cash-withdraw.schema';

@Schema({ timestamps: true })
export class CashierSession {
  @Prop({ trim: true })
  startDate: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Bills' }],
    default: [],
  })
  bills: Bills[];

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

  @Prop({ trim: true })
  endDate: string;

  @Prop({ trim: true, default: true })
  enable?: boolean;

  @Prop({ required: true })
  initialQuantity: string;

  @Prop({ trim: true, default: '0.00' })
  totalDebit?: string;

  @Prop({ trim: true, default: '0.00' })
  totalCredit?: string;

  @Prop({ trim: true, default: '0.00' })
  totalCash?: string;

  @Prop({ trim: true, default: 'active' })
  status?: string;

  @Prop({
    trim: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CashWithdraw' }],
    ref: 'CashWithdraw',
    default: [],
  })
  cashWithdraw?: CashWithdraw[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'OperatingPeriod' })
  operatingPeriod: OperatingPeriod;
}

export const CashierSessionSchema =
  SchemaFactory.createForClass(CashierSession);
