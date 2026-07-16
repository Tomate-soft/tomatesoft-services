export interface OperatingPeriodDto {
  _id: string;
  status: string;
  createdAt: string;
  operationalClousure?: any;
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
