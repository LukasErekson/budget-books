import Transaction from '../../../features/Transactions/types/types';

import {
  setTransactions,
  setTransactionsIsLoaded,
  categorizeTransaction,
  categorizeManyTransactions,
  deleteTransaction,
} from '../../../features/Transactions/stores/transactionSlice';

describe('transactionSlice Reducers', () => {
  describe('setTransactions', () => {
    it.todo('Properly sets transaction list with debits and credits.');
  });

  describe('setTransactionsIsLoaded', () => {
    it.todo('Updates isTransactionsLoaded state');
  });

  describe('categorizeTransaction', () => {
    it.todo('Properly updates the state by modifying a single transaction');
  });

  describe('categorizeManyTransactions', () => {
    it.todo('Properly updates multiple transactions');
  });

  describe('deleteTransaction', () => {
    it.todo('Removes the transaction from state');
  });
});
