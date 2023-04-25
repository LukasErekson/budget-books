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

import Transaction from '../../../features/Transactions/types/types';
import * as BadResponseError from '../../../utils/BadResponseError';
import Account from '../../../features/Accounts/types/types';

describe('Transaction Thunks', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');
  const BadResponseMock = jest.spyOn(BadResponseError, 'default');

  const mockStore = setupStore();
  const dispatch = mockStore.dispatch;

  const fakeTransactions: Transaction[] = [
    {
      id: 1,
      name: 'Jesting Supplies',
      description: 'Jesting supplies for all your testing needs!',
      amount: 30.25,
      debit_account_id: 1,
      credit_account_id: 'undefined',
      transaction_date: '03/20/2023',
      date_entered: '04/13/2023',
    },
    {
      id: 3,
      name: 'Credit card payment',
      description: 'Credit Card Payment',
      amount: 30.25,
      debit_account_id: 'undefined',
      credit_account_id: 1,
      transaction_date: '03/22/2023',
      date_entered: '04/13/2023',
    },
  ];

  const fakeAccounts: Account[] = [
    {
      id: 1,
      name: 'Account 1',
      account_type_id: 1,
      account_type: 'Test',
      debit_inc: true,
      balance: 0.0,
      last_updated: '01/01/2023',
    },
    {
      id: 2,
      name: 'Account 22',
      account_type_id: 1,
      account_type: 'Test',
      debit_inc: true,
      balance: 0.0,
      last_updated: '01/01/2023',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAccountTransactions', () => {
    it('Defaults categorized_status to "all"', async () => {
      const dataFetchReturn = {
        responsePromise: new Promise<any>((resolve, reject) => {
          resolve({
            ok: true,
            json: () => ({
              transactions: fakeTransactions,
            }),
          });
        }),
        cancel: () => null,
      };

      DataFetchMock.mockReturnValue(dataFetchReturn);

      await dispatch(fetchAccountTransactions(fakeAccounts[0]));

      expect(DataFetchMock).toHaveBeenCalledWith(
        'GET',
        '/api/transactions?account_ids=1&categorize_type=all'
      );
    });

    describe('Given an ok response', () => {
      it('Dispatches setTransactions and setTransactionsIsLoaded', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                transactions: fakeTransactions,
              }),
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const setTransactions = jest.spyOn(
          TransactionActions,
          'setTransactions'
        );

        const setTransactionsIsLoaded = jest.spyOn(
          TransactionActions,
          'setTransactionsIsLoaded'
        );

        await dispatch(fetchAccountTransactions(fakeAccounts[0]));

        expect(setTransactions).toHaveBeenCalledWith({
          transactions: fakeTransactions,
        });

        expect(setTransactionsIsLoaded).toHaveBeenCalledWith({ loaded: true });
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
              json: () => ({
                transactions: fakeTransactions,
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        await dispatch(fetchAccountTransactions(fakeAccounts[0]));

        expect(BadResponseMock).toHaveBeenCalled();
      });
    });
  });

  describe('fetchBankAccountTransactions', () => {
    it('Defaults categorized_status to "all"', async () => {
      const dataFetchReturn = {
        responsePromise: new Promise<any>((resolve, reject) => {
          resolve({
            ok: true,
            json: () => ({
              transactions: fakeTransactions,
            }),
          });
        }),
        cancel: () => null,
      };

      DataFetchMock.mockReturnValue(dataFetchReturn);

      await dispatch(fetchBankAccountTransactions(fakeAccounts));

      expect(DataFetchMock).toHaveBeenCalledWith(
        'GET',
        '/api/transactions?account_ids=1,2&categorize_type=all'
      );
    });

    describe('Given an ok response', () => {
      it('Dispatches setTransactions and setTransactionsIsLoaded', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                transactions: fakeTransactions,
              }),
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const setTransactions = jest.spyOn(
          TransactionActions,
          'setTransactions'
        );

        const setTransactionsIsLoaded = jest.spyOn(
          TransactionActions,
          'setTransactionsIsLoaded'
        );

        await dispatch(fetchBankAccountTransactions(fakeAccounts));

        expect(setTransactions).toHaveBeenCalledWith({
          transactions: fakeTransactions,
        });

        expect(setTransactionsIsLoaded).toHaveBeenCalledWith({
          loaded: true,
        });
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
              json: () => ({
                transactions: fakeTransactions,
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        await dispatch(fetchBankAccountTransactions(fakeAccounts));

        expect(BadResponseMock).toHaveBeenCalled();
      });
    });
  });
  describe('addTransactionCategory', () => {
    describe('Given an ok response', () => {
      it('Dispatches categorizeTransaction and setTransactionsIsLoaded', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                transactions: fakeTransactions,
                message: 'SUCCESS',
              }),
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const categorizeTransaction = jest.spyOn(
          TransactionActions,
          'categorizeTransaction'
        );

        const setTransactionsIsLoaded = jest.spyOn(
          TransactionActions,
          'setTransactionsIsLoaded'
        );

        await dispatch(addTransactionCategory(fakeAccounts[0], 1, 2, 'debit'));

        expect(setTransactionsIsLoaded).toHaveBeenCalledWith({
          loaded: false,
        });

        expect(categorizeTransaction).toHaveBeenCalledWith({
          accountID: fakeAccounts[0].id,
          categoryID: 2,
          debitOrCredit: 'debit',
          transactionID: 1,
        });
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'FAILURE',
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        await dispatch(addTransactionCategory(fakeAccounts[0], 1, 2, 'debit'));

        expect(BadResponseMock).toHaveBeenCalled();
      });
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
