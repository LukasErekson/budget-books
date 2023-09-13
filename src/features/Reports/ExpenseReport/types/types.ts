export type ExpenseReportResponse = {
  [accountGroup: string]: {
    [accountType: string]: {
      [accountName: string]: number[];
    };
  };
};
export enum ReportFrequency {
  annually = 'year',
  monthly = 'month',
  weekly = 'week',
  daily = 'day',
}
