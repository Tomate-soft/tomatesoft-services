export interface OperationalClosure {
  state: string;
  totalSellsAmount: number;
  totalRestaurantAmount: number;
  totalToGoOrdersAmount: number;
  totalPhoneAmount: number;
  totalRappiAmount: number;
  togoOrdersTotal: number;
  totalCashInAmount: number;
  phoneOrdersTotal: number;
  rappiOrdersTotal: number;
  totalDebitAmount: number;
  totalCreditAmount: number;
  totalTransferAmount: number;
  restaurantOrdersTotal: number;
  finishedAccounts: number;
  totalDiners: number;
  numberOfDiscounts: number;
  discountTotalAmount: number;
  numberOfCourtesy: number;
  courtesyTotalAmount: number;
  numberOfCancellations: number;
  cancellationsTotalAmount: number;
  balanceSheet: {
    balanceSheet: number;
    totalIncome: number;
    totalExpense: number;
  };
}

export interface OperatingPeriodDto {
  _id: string;
  status: string;
  createdAt: string;
  operationalClousure?: OperationalClosure;
  invoicedAccounts?: any[];
  totalInvoicedAccounts?: number;
  highestFolioNumber?: number;
}

export interface OperatingPeriodRepository {
  //   findById(id: string): Promise<OperatingPeriod | null>;
  findByMonth(
    month: string,
  ): Promise<{ periods: OperatingPeriodDto[]; processed?: boolean }>;
}

export const OPERATING_PERIOD_REPOSITORY = 'OPERATING_PERIOD_REPOSITORY';
