export type ExpenseReportResponse = {
  [accountGroup: string]: {
    [accountType: string]: {
      [accountName: string]: number[];
    };
  };
} & { dates: string[] };

export enum ReportFrequency {
  annually = 'year',
  monthly = 'month',
  weekly = 'week',
  daily = 'day',
}
