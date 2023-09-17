import React from 'react';
import ExpenseReportForm from '../features/Reports/ExpenseReport/ExpenseReportForm';
import { useSelector } from 'react-redux';
import { ExpenseReportResponse } from '../features/Reports/ExpenseReport/types/types';
import { RootState } from '../stores/store';
import ExpenseReport from '../features/Reports/ExpenseReport/ExpenseReport';

function ExpenseReportPage(): JSX.Element {
  const currentReportData: ExpenseReportResponse | null = useSelector(
    (state: RootState) => state.expenseReportSlice.currentReport
  );

  return (
    <>
      <h1>Expense Report Page</h1>
      <ExpenseReportForm />

      {currentReportData && <ExpenseReport reportData={currentReportData} />}
    </>
  );
}

export default ExpenseReportPage;
