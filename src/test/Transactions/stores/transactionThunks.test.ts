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
import * as TransactionThunks from '../../../features/Transactions/stores/transactionThunks';
import * as AccountThunks from '../../../features/Accounts/stores/accountThunks';

import Transaction from '../../../features/Transactions/types/types';
import * as BadResponseError from '../../../utils/BadResponseError';
import Account from '../../../features/Accounts/types/types';
import { transactionData } from '../../../features/CategorizeTransactions/types/types';

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
      it('Dispatches categorizeManyTransactions and setTransactionsIsLoaded', async () => {
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

        const categorizeManyTransactions = jest.spyOn(
          TransactionActions,
          'categorizeManyTransactions'
        );

        const setTransactionsIsLoaded = jest.spyOn(
          TransactionActions,
          'setTransactionsIsLoaded'
        );

        await dispatch(
          addManyTransactionCategories(fakeAccounts[0], fakeTransactions, 2)
        );

        expect(setTransactionsIsLoaded).toHaveBeenCalledWith({
          loaded: false,
        });

        expect(categorizeManyTransactions).toHaveBeenCalledWith({
          accountID: fakeAccounts[0].id,
          categoryID: 2,
          transactionInfo: fakeTransactions.map((transaction, idx) => ({
            id: transaction.id,
            debitOrCredit: idx ? 'debit' : 'credit',
          })),
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

        await dispatch(
          addManyTransactionCategories(fakeAccounts[0], fakeTransactions, 2)
        );

        expect(BadResponseMock).toHaveBeenCalled();
      });
    });
  });

  describe('addTransaction', () => {
    describe('Given an ok response', () => {
      it('Dispatches fetchAccountTransactions and setTransactionsIsLoaded', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'SUCCESS',
              }),
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const setTransactionsIsLoaded = jest.spyOn(
          TransactionActions,
          'setTransactionsIsLoaded'
        );

        const fetchAccountTransactionsMock = jest.spyOn(
          TransactionThunks,
          'fetchAccountTransactions'
        );

        const fakeTransactionData: transactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction without a debit id',
          amount: 20.35,
          credit_account_id: 1,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(setTransactionsIsLoaded).toHaveBeenCalledWith({
          loaded: false,
        });

        expect(fetchAccountTransactionsMock).toHaveBeenCalled();

        fetchAccountTransactionsMock.mockRestore();
      });

      it('Dispatches fetchAccountBalance for a credit ID', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'SUCCESS',
              }),
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const fetchAccountBalancesMock = jest.spyOn(
          AccountThunks,
          'fetchAccountBalances'
        );

        const fakeTransactionData: transactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction without a debit id',
          amount: 20.35,
          credit_account_id: 1,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(fetchAccountBalancesMock).toHaveBeenCalledWith([1]);

        fetchAccountBalancesMock.mockRestore();
      });

      it('Dispatches fetchAccountBalance for a debit ID', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'SUCCESS',
              }),
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const fetchAccountBalancesMock = jest.spyOn(
          AccountThunks,
          'fetchAccountBalances'
        );

        const fakeTransactionData: transactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction without a credit id',
          amount: 20.35,
          debit_account_id: 1,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(fetchAccountBalancesMock).toHaveBeenCalledWith([1]);

        fetchAccountBalancesMock.mockRestore();
      });

      it('Dispatches fetchAccountBalance for a debit ID', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'SUCCESS',
              }),
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const fetchAccountBalancesMock = jest.spyOn(
          AccountThunks,
          'fetchAccountBalances'
        );

        const fakeTransactionData: transactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction',
          amount: 20.35,
          debit_account_id: 1,
          credit_account_id: 2,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(fetchAccountBalancesMock).toHaveBeenCalledWith([1, 2]);

        fetchAccountBalancesMock.mockRestore();
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError with a message if given', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'FAILURE',
                serverError: 'Something went wrong with the request',
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const fakeTransactionData: transactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction',
          amount: 20.35,
          debit_account_id: 1,
          credit_account_id: 2,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(BadResponseMock).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'Something went wrong with the request'
        );
      });

      it('Throws a BadResponseError if given a general server error.', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        const fakeTransactionData: transactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction',
          amount: 20.35,
          debit_account_id: 1,
          credit_account_id: 2,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(BadResponseMock).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
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
