import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { DailyRegister } from '../pos/ops/users/dailyRegister';
import { CashierSession } from '../pos/ops/till/cashier-session.schema';
import { OperationalClousure } from './operational-closure.schema';
import { User } from '../..';
import { MoneyMovement } from '../pos/ops/till/money-movement.schema';

const { ObjectId } = MongooseSchema.Types;

interface CashIn {
  init: boolean;
  amount: string;
}

export enum OperatingPeriodState {
  ACTIVE = 'ACTIVE',
  CONFLICT = 'CONFLICT',
  CLOSED = 'CLOSED',
  APPROVED = 'APPROVED',
}

export interface CheckInRegister {
  idempotencyKey?: string;
  name: string;
  diners: number;
  initialTime: string;
  finalTime: string;
  resumeTime: string;
  status: string;
}

@Schema({ timestamps: true })
export class OperatingPeriod {
  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdAt: Date;

  @Prop({
    default: [],
    type: [{ type: ObjectId, ref: 'DailyRegister' }],
  })
  dailyRegisters: DailyRegister[];

  @Prop({
    default: [],
    type: [{ type: ObjectId, ref: 'CashierSession' }],
  })
  sellProcess: CashierSession[];

  @Prop({ required: true, default: '0.00' })
  withdrawals?: string;

  @Prop({
    type: {
      init: { type: Boolean, default: false },
      amount: { type: String, default: '$0.00' },
    },
    default: { init: false, amount: '$0.00' },
  })
  cashIn: CashIn;

  @Prop({
    trim: true,
    type: [{ type: ObjectId, ref: 'MoneyMovement' }],
    ref: 'MoneyMovement',
    default: [],
  })
  moneyMovements: MoneyMovement[];

  // Aquí solo referenciamos la clase
  @Prop({ type: OperationalClousure })
  operationalClousure?: OperationalClousure;

  @Prop({ type: ObjectId, ref: 'User' })
  approvedBy?: User;

  @Prop({ default: [] })
  registers?: CheckInRegister[];
}

export const OperatingPeriodSchema =
  SchemaFactory.createForClass(OperatingPeriod);

// Índice compuesto para optimizar queries de rango de fechas
OperatingPeriodSchema.index({ createdAt: 1, status: 1 });
