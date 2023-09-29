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
import BadResponseError from '../../../utils/BadResponseError';
jest.mock('../../../utils/BadResponseError');

import Account from '../../../features/Accounts/types/types';
import {
  UploadableTransaction,
  TransactionData,
} from '../../../features/CategorizeTransactions/types/types';
import { fakeAccounts } from '../../Accounts/mockAccounts';

describe('Transaction Thunks', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');

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

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
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
        '/api/transactions?account_ids=1,2,3&categorize_type=all'
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

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
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
      it('Throws a BadResponseError with a given message if provided', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'Problem converting data types probably.',
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        await dispatch(addTransactionCategory(fakeAccounts[0], 1, 2, 'debit'));

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'Problem converting data types probably.',
          'There was an irrecoverable server error.'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
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

        await dispatch(addTransactionCategory(fakeAccounts[0], 1, 2, 'debit'));

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
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
      it('Throws a BadResponseError with a message if given', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'FAILURE',
                serverError:
                  'The following transactions failed to be categorized: []',
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

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'The following transactions failed to be categorized: []'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
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

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
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

        const fakeTransactionData: TransactionData = {
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

        const fakeTransactionData: TransactionData = {
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

        const fakeTransactionData: TransactionData = {
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

        const fakeTransactionData: TransactionData = {
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

        const fakeTransactionData: TransactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction',
          amount: 20.35,
          debit_account_id: 1,
          credit_account_id: 2,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'Something went wrong with the request'
        );
      });

      it('Throws a BadResponseError if ok is false', async () => {
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

        const fakeTransactionData: TransactionData = {
          name: 'Fake Transaction',
          description: 'This is a fake transaction',
          amount: 20.35,
          debit_account_id: 1,
          credit_account_id: 2,
          transaction_date: '03/22/2023',
        };

        await dispatch(addTransaction(fakeAccounts[0], fakeTransactionData));

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
    });
  });

  describe('deleteTransactions', () => {
    describe('Given an ok response', () => {
      it('Dispatches deleteTransaction and setTransactionsIsLoaded', async () => {
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

        const deleteTransaction = jest.spyOn(
          TransactionActions,
          'deleteTransaction'
        );

        const setTransactionsIsLoaded = jest.spyOn(
          TransactionActions,
          'setTransactionsIsLoaded'
        );

        const fetchAccountBalancesMock = jest.spyOn(
          AccountThunks,
          'fetchAccountBalances'
        );

        await dispatch(deleteTransactions(fakeTransactions));

        expect(setTransactionsIsLoaded).toHaveBeenCalledWith({
          loaded: false,
        });

        expect(deleteTransaction).toHaveBeenCalledWith({
          idsToDelete: fakeTransactions.map((transaction) => transaction.id),
          changedAccountIds: [1],
        });

        expect(fetchAccountBalancesMock).toHaveBeenCalledWith([1]);
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
                serverError:
                  'The following transactions failed to be deleted: []',
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        await dispatch(deleteTransactions(fakeTransactions));

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'The following transactions failed to be deleted: []'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
              json: () => ({
                message: 'FAILURE',
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        await dispatch(deleteTransactions(fakeTransactions));

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
    });
  });
  describe('uploadTransactions', () => {
    const fakeUploadableTransactions: UploadableTransaction[] = [
      {
        name: 'Jesting Supplies',
        description: 'Jesting supplies for all your testing needs!',
        amount: 30.25,
        debit_account_id: 1,
        transaction_date: '03/20/2023',
      },
      {
        name: 'Credit card payment',
        description: 'Credit Card Payment',
        amount: 30.25,
        credit_account_id: 1,
        transaction_date: '03/22/2023',
      },
    ];
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

        const fetchAccountTransactions = jest.spyOn(
          TransactionThunks,
          'fetchAccountTransactions'
        );

        await dispatch(
          uploadTransactions(fakeAccounts[0], fakeUploadableTransactions)
        );

        expect(setTransactionsIsLoaded).toHaveBeenCalledWith({
          loaded: false,
        });

        expect(fetchAccountTransactions).toHaveBeenCalledWith(fakeAccounts[0]);
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
                serverError:
                  'The following transactions failed to be uploaded: []',
              }),
              status: 500,
            });
          }),
          cancel: () => null,
        };

        DataFetchMock.mockReturnValue(dataFetchReturn);

        await dispatch(
          uploadTransactions(fakeAccounts[0], fakeUploadableTransactions)
        );

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'The following transactions failed to be uploaded: []'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
        const dataFetchReturn = {
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
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
          uploadTransactions(fakeAccounts[0], fakeUploadableTransactions)
        );

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
    });
  });
});
