import { createSlice } from '@reduxjs/toolkit';
import { ExpenseReportOptions, ExpenseReportResponse } from '../types/types';

export const expenseReportSlice = createSlice({
  name: 'expenseReportSlice',
  initialState: {
    currentReport: null as ExpenseReportResponse | null,
    currentReportOptions: null as ExpenseReportOptions | null,
  },
  reducers: {
    storeGeneratedReport: (state, action) => {
      const reportResponse: ExpenseReportResponse = action.payload.reportData;
      const reportOptions: ExpenseReportOptions = action.payload.options;
      return {
        ...state,
        currentReport: reportResponse,
        currentReportOptions: reportOptions,
      };
    },
  },
});

export const { storeGeneratedReport } = expenseReportSlice.actions;

export default expenseReportSlice.reducer;
