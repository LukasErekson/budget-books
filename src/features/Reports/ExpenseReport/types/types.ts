export type ExpenseReportResponse = AccountGroupsToBalances & {
  dates: string[];
};

export type AccountGroupsToBalances = {
  [accountGroup: string]: {
    [accountType: string]: {
      [accountName: string]: number[];
    };
  };
};

export type ExpenseReportOptions = {
  comparePreviousYear: boolean;
  compareYearToDate: boolean;
};

export enum ReportFrequency {
  annually = 'year',
  monthly = 'month',
  weekly = 'week',
  daily = 'day',
}
