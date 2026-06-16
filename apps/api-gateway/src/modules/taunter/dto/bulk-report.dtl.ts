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

// 1. Enum para el estado del cierre
export enum ClosureState {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// 2. Objeto balanceSheet (que viene dentro de operational_closure)
export class BalanceSheetDto {
  @IsNumber()
  balance_sheet: number;

  @IsNumber()
  total_expense: number;

  @IsNumber()
  total_income: number;
}

// 3. Objeto operational_closure
export class OperationalClosureDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BalanceSheetDto)
  balanceSheet: BalanceSheetDto; // Mapea el objeto balanceSheet

  @IsNumber()
  @Min(0)
  cancellationsTotalAmount: number;

  @IsNumber()
  @Min(0)
  courtesyTotalAmount: number;

  @IsNumber()
  @Min(0)
  discountTotalAmount: number;

  @IsNumber()
  @Min(0)
  finishedAccounts: number;

  @IsNumber()
  @Min(0)
  numberOfCancellations: number;

  @IsNumber()
  @Min(0)
  numberOfCourtesy: number;

  @IsNumber()
  @Min(0)
  numberOfDiscounts: number;

  @IsNumber()
  @Min(0)
  phoneOrdersTotal: number;

  @IsNumber()
  @Min(0)
  rappiOrdersTotal: number;

  @IsNumber()
  @Min(0)
  restaurantOrdersTotal: number;

  @IsEnum(ClosureState)
  state: ClosureState;

  @IsNumber()
  @Min(0)
  togoOrdersTotal: number;

  @IsNumber()
  @Min(0)
  totalCashInAmount: number;

  @IsNumber()
  @Min(0)
  totalCreditAmount: number;

  @IsNumber()
  @Min(0)
  totalDebitAmount: number;

  @IsNumber()
  @Min(0)
  totalDiners: number;

  @IsNumber()
  @Min(0)
  totalPhoneAmount: number;

  @IsNumber()
  @Min(0)
  totalRappiAmount: number;

  @IsNumber()
  @Min(0)
  totalRestaurantAmount: number;

  @IsNumber()
  @Min(0)
  totalSellsAmount: number;

  @IsNumber()
  @Min(0)
  totalToGoOrdersAmount: number;

  @IsNumber()
  @Min(0)
  totalTransferAmount: number;

  @IsString()
  @IsNotEmpty()
  _id: string;
}

// 4. Estructura de un solo Reporte (El objeto dentro del Array)
export class OperationalReportDto {
  @IsString()
  @IsNotEmpty()
  created_at: string;

  @IsNumber()
  highest_folio_number: number;

  @IsString()
  @IsNotEmpty()
  id: string; // El id principal en la raíz que es string

  @IsArray()
  invoiced_accounts: any[]; // Viene como Array(0), puedes tiparlo si tiene estructura interna

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OperationalClosureDto)
  operational_closure: OperationalClosureDto;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  total_invoiced_accounts: number;
}

// 5. DTO PRINCIPAL PARA EL CONTROLLER (Recibe el Array completo)
export class CreateBulkReportsDto {
  @IsArray()
  @ValidateNested({ each: true }) // El 'each: true' es mandatorio para validar cada elemento del array
  @Type(() => OperationalReportDto)
  reports: OperationalReportDto[];
}
