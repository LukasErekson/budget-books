import { createSlice } from '@reduxjs/toolkit';
import { ExpenseReportResponse } from '../types/types';

export const expenseReportSlice = createSlice({
  name: 'expenseReportSlice',
  initialState: {
    currentReport: null as ExpenseReportResponse | null,
  },
  reducers: {
    storeGeneratedReport: (state, action) => {
      const reportResponse: ExpenseReportResponse = action.payload;
      return {
        ...state,
        currentReport: reportResponse,
      };
    },
  },
});

export const { storeGeneratedReport } = expenseReportSlice.actions;

export default expenseReportSlice.reducer;
