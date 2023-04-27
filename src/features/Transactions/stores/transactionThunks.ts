import {
  setTransactions,
  setTransactionsIsLoaded,
  categorizeTransaction,
  deleteTransaction,
  categorizeManyTransactions,
} from './transactionSlice';
import DataFetch from '../../../utils/DataFetch';
import BadResponseError from '../../../utils/BadResponseError';
import Transaction from '../types/types';
import {
  TransactionData,
  UploadableTransaction,
} from '../../CategorizeTransactions/types/types';
import Account from '../../Accounts/types/types';
import { fetchAccountBalances } from '../../Accounts/stores/accountThunks';
import { AppDispatch } from '../../../stores/store';

export const fetchAccountTransactions =
  (account: Account, categorized_status = 'all') =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/transactions?account_ids=${account.id}&categorize_type=${categorized_status}`
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: { transactions: Transaction[] } =
          await response.json();

        dispatch(setTransactions(responseData));
        dispatch(setTransactionsIsLoaded({ loaded: true }));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error);
    }
  };

export const fetchBankAccountTransactions =
  (bankAccounts: Account[], categorized_status = 'all') =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/transactions?account_ids=${bankAccounts.map(
          (account: Account) => account.id
        )}&categorize_type=${categorized_status}`
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: { transactions: Transaction[] } =
          await response.json();

        dispatch(setTransactions(responseData));
        dispatch(setTransactionsIsLoaded({ loaded: true }));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error);
    }
  };

export const addTransactionCategory =
  (
    account: Account,
    transaction_id: number,
    category_id: number,
    debit_or_credit: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'PUT',
        '/api/transactions',
        {
          transactions: [
            {
              transaction_id,
              category_id,
              debit_or_credit: debit_or_credit,
            },
          ],
        }
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: { message: string; serverError?: string } =
          await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        dispatch(setTransactionsIsLoaded({ loaded: false }));
        dispatch(
          categorizeTransaction({
            accountID: account.id,
            transactionID: transaction_id,
            categoryID: category_id,
            debitOrCredit: debit_or_credit,
          })
        );

        dispatch(fetchAccountBalances([account.id, category_id]));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error.status, error.message, error.serverError);
    }
  };

export const addManyTransactionCategories =
  (account: Account, transactions: Transaction[], category_id: number) =>
  async (dispatch: AppDispatch) => {
    try {
      const postableTransactions: {
        transaction_id: number;
        category_id: number;
        debit_or_credit: 'credit' | 'debit';
      }[] = transactions.map((transaction) => ({
        transaction_id: transaction.id,
        category_id,
        debit_or_credit:
          transaction.debit_account_id !== 'undefined' ? 'credit' : 'debit',
      }));

      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'PUT',
        '/api/transactions',
        {
          transactions: postableTransactions,
        }
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: { message: string; serverError?: string } =
          await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        dispatch(setTransactionsIsLoaded({ loaded: false }));
        dispatch(
          categorizeManyTransactions({
            accountID: account.id,
            transactionInfo: postableTransactions.map((transaction) => ({
              id: transaction.transaction_id,
              debitOrCredit: transaction.debit_or_credit,
            })),
            categoryID: category_id,
          })
        );

        dispatch(fetchAccountBalances([account.id, category_id]));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error.status, error.message, error.serverError);
    }
  };

export const addTransaction =
  (account: Account, transactionData: TransactionData) =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        name,
        description,
        amount,
        credit_account_id,
        debit_account_id,
        transaction_date,
      } = transactionData;

      const { responsePromise }: { responsePromise: Promise<Response> } =
        DataFetch('POST', '/api/transactions', {
          transactions: [
            {
              name,
              description,
              amount,
              credit_account_id,
              debit_account_id,
              transaction_date,
            },
          ],
        });

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: { message: string; serverError?: string } =
          await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        dispatch(setTransactionsIsLoaded({ loaded: false }));
        dispatch(fetchAccountTransactions(account));

        const changedAccountIds: number[] = [];

        if (debit_account_id) {
          changedAccountIds.push(debit_account_id);
        }

        if (credit_account_id) {
          changedAccountIds.push(credit_account_id);
        }

        dispatch(fetchAccountBalances(changedAccountIds));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error.status, error.message, error.serverError);
    }
  };

export const deleteTransactions =
  (transactionsToDelete: Transaction[]) => async (dispatch: AppDispatch) => {
    try {
      const idsToDelete: number[] = transactionsToDelete.map(
        (txn: Transaction) => txn.id
      );

      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'DELETE',
        '/api/transactions',
        {
          transaction_ids: idsToDelete,
        }
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: { message: string; serverError?: string } =
          await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }

      const changedAccountIds: number[] = [];

      transactionsToDelete.forEach((transaction: Transaction) => {
        if (
          +transaction.credit_account_id &&
          !changedAccountIds.includes(+transaction.credit_account_id)
        ) {
          changedAccountIds.push(+transaction.credit_account_id);
        }

        if (
          +transaction.debit_account_id &&
          !changedAccountIds.includes(+transaction.debit_account_id)
        ) {
          changedAccountIds.push(+transaction.debit_account_id);
        }
      });

      dispatch(setTransactionsIsLoaded({ loaded: false }));
      dispatch(deleteTransaction({ idsToDelete, changedAccountIds }));
      dispatch(fetchAccountBalances(changedAccountIds));
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error.status, error.message, error.serverError);
    }
  };

export const uploadTransactions =
  (account: Account, transactionsToUpload: UploadableTransaction[]) =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'POST',
        '/api/transactions',
        {
          transactions: transactionsToUpload,
        }
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: { message: string; serverError?: string } =
          await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        dispatch(setTransactionsIsLoaded({ loaded: false }));
        dispatch(fetchAccountTransactions(account));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error.status, error.message, error.serverError);
    }
  };
