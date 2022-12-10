import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const selectSelf = (state: RootState) => state;

export const selectTransctions = createSelector(
  [selectSelf, (state: RootState, accountID: string) => accountID],
  (state: any, accountID: string) => {
    if (accountID in state.transactions.transactionList) {
      return state.transactions.transactionList[accountID];
    }
    return [];
  }
);

export const selectUncategorizedTransactions = createSelector(
  [selectSelf, (state: RootState, accountID: string) => accountID],
  (state: any, accountID: string) => {
    if (accountID in state.transactions.transactionList) {
      return state.transactions.transactionList[accountID].filter(
        (transaction: any) => {
          return (
            transaction.debit_account_id === 'undefined' ||
            transaction.credit_account_id === 'undefined'
          );
        }
      );
    }
    return [];
  }
);
