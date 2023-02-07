import { RootState } from '../../store';
import Transaction from './transactionTSTypes';

export const selectTransctions = (
  state: RootState,
  accountID: number
): Transaction[] => {
  if (accountID in state.transactions.transactionList) {
    return state.transactions.transactionList[accountID];
  }
  return [];
};

export const selectUncategorizedTransactions = (
  state: RootState,
  accountID: number
): Transaction[] => {
  if (accountID in state.transactions.transactionList) {
    return state.transactions.transactionList[accountID].filter(
      (transaction: Transaction) => {
        return (
          transaction.debit_account_id === 'undefined' ||
          transaction.credit_account_id === 'undefined'
        );
      }
    );
  }
  return [];
};
