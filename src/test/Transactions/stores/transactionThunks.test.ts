import {
  fetchAccountTransactions,
  fetchBankAccountTransactions,
  addTransactionCategory,
  addManyTransactionCategories,
  addTransaction,
  deleteTransactions,
  uploadTransactions,
} from '../../../features/Transactions/stores/transactionThunks';

import { setupStore } from '../../../stores/store';

import * as TransactionActions from '../../../features/Transactions/stores/transactionSlice';
import * as DataFetch from '../../../utils/DataFetch';

import { mockThunkReturn } from '../../setupTests';
import Transaction from '../../../features/Transactions/types/types';
import BadResponseError from '../../../utils/BadResponseError';

describe('Transaction Thunks', () => {
  describe('fetchAccountTransactions', () => {
    describe('Given an ok response', () => {
      it.todo('Defaults categorized_status to "all"');

      it.todo('Dispatches setTransactions and setTransactionsIsLoaded');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
  describe('fetchBankAccountTransactions', () => {
    describe('Given an ok response', () => {
      it.todo('Defaults categorized_status to "all"');

      it.todo('Dispatches setTransactions and setTransactionsIsLoaded');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
  describe('addTransactionCategory', () => {
    describe('Given an ok response', () => {
      it.todo('Dispatches categorizeTransaction and setTransactionsIsLoaded');

      it.todo('Dispatches the thunk fetchAccountBalances');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
  describe('addManyTransactionCategories', () => {
    describe('Given an ok response', () => {
      it.todo(
        'Dispatches categorizeManyTransactions and setTransactionsIsLoaded'
      );

      it.todo('Dispatches the thunk fetchAccountBalances');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
  describe('addTransaction', () => {
    describe('Given an ok response', () => {
      it.todo('');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
  describe('deleteTransactions', () => {
    describe('Given an ok response', () => {
      it.todo('');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
  describe('uploadTransactions', () => {
    describe('Given an ok response', () => {
      it.todo('');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
});
