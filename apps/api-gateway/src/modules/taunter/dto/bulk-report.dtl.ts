import {
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// 1. Enum para el estado del cierre (Agregué CLOSED que viene en tu nuevo JSON)
export enum ClosureState {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

// 2. DTO para el objeto balance_sheet
export class BalanceSheetDto {
  @IsNumber()
  balance_sheet: number;

  @IsNumber()
  total_income: number;

  @IsNumber()
  total_expense: number;
}

// 3. DTO para el objeto operational_closure (Todo a snake_case)
export class OperationalClosureDto {
  @IsEnum(ClosureState)
  state: ClosureState;

  @IsNumber()
  @Min(0)
  total_sales_amount: number;

  @IsNumber()
  @Min(0)
  total_restaurant_amount: number;

  @IsNumber()
  @Min(0)
  total_to_go_orders_amount: number;

  @IsNumber()
  @Min(0)
  total_phone_amount: number;

  @IsNumber()
  @Min(0)
  total_rappi_amount: number;

  @IsNumber()
  @Min(0)
  to_go_orders_total: number;

  @IsNumber()
  @Min(0)
  total_cash_in_amount: number;

  @IsNumber()
  @Min(0)
  phone_orders_total: number;

  @IsNumber()
  @Min(0)
  rappi_orders_total: number;

  @IsNumber()
  @Min(0)
  total_debit_amount: number;

  @IsNumber()
  @Min(0)
  total_credit_amount: number;

  @IsNumber()
  @Min(0)
  total_transfer_amount: number;

  @IsNumber()
  @Min(0)
  restaurant_orders_total: number;

  @IsNumber()
  @Min(0)
  finished_accounts: number;

  @IsNumber()
  @Min(0)
  total_diners: number;

  @IsNumber()
  @Min(0)
  number_of_discounts: number;

  @IsNumber()
  @Min(0)
  discount_total_amount: number;

  @IsNumber()
  @Min(0)
  number_of_courtesy: number;

  @IsNumber()
  @Min(0)
  courtesy_total_amount: number;

  @IsNumber()
  @Min(0)
  number_of_cancellations: number;

  @IsNumber()
  @Min(0)
  cancellations_total_amount: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BalanceSheetDto)
  balance_sheet: BalanceSheetDto;

  @IsString()
  @IsNotEmpty()
  id: string; // El id interno de la clausura
}

// 4. DTO para un solo Reporte Operativo
export class OperationalReportDto {
  @IsString()
  @IsNotEmpty()
  id: string; // El id principal en la raíz

  @IsBoolean()
  status: boolean;

  @IsString()
  @IsNotEmpty()
  created_at: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OperationalClosureDto)
  operational_closure: OperationalClosureDto;

  @IsArray()
  invoiced_accounts: any[]; // Puedes cambiar "any" si luego tipas las cuentas facturadas

  @IsNumber()
  @Min(0)
  total_invoiced_accounts: number;

  @IsNumber()
  @Min(0)
  highest_folio_number: number;
}

// 5. DTO Principal (Wrapper para cuando recibes la lista de reportes en el Bulk)
export class CreateBulkReportsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperationalReportDto)
  reports: OperationalReportDto[];
}
