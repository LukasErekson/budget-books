import React from 'react';
import ExpenseReportForm from '../features/Reports/ExpenseReport/ExpenseReportForm';
import { useSelector } from 'react-redux';
import { ExpenseReportResponse } from '../features/Reports/ExpenseReport/types/types';
import { RootState } from '../stores/store';

function ExpenseReportPage(): JSX.Element {
  const currentReportData: ExpenseReportResponse | null = useSelector(
    (state: RootState) => state.expenseReportSlice.currentReport
  );

  console.log(currentReportData);
  return (
    <>
      <h1>Expense Report Page</h1>
      <ExpenseReportForm />
    </>
  );
}

export default ExpenseReportPage;
