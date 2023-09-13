import type { PreloadedState } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from '../features/Accounts/stores/accountSlice';
import accountTypeReducer from '../features/AccountTypes/stores/accountTypeSlice';
import pageSliceReducer from './PageSlice';
import transactionReducer from '../features/Transactions/stores/transactionSlice';
import expenseReportReducer from '../features/Reports/ExpenseReport/stores/ExpenseReportSlice';
const rootReducer: any = combineReducers({
  accounts: accountReducer,
  accountTypes: accountTypeReducer,
  pageSlice: pageSliceReducer,
  transactions: transactionReducer,
  expenseReportSlice: expenseReportReducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
