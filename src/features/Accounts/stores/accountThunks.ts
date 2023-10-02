import { changeCategorizationActiveAccount } from '../../../stores/PageSlice';
import { AppDispatch } from '../../../stores/store';
import BadResponseError from '../../../utils/BadResponseError';
import DataFetch from '../../../utils/DataFetch';
import { fetchAccountTypes } from '../../AccountTypes/stores/accountTypeThunks';
import AccountType from '../../AccountTypes/types/types';
import Account from '../types/types';
import {
  loadAccounts,
  removeAccount,
  updateAccountBalances,
  updateAccountInfo,
} from './accountSlice';

export const fetchAccounts =
  (accountType = 'all') =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/accounts?account_type=${accountType}`
      );

      const response: Response = await responsePromise;
      if (response.ok) {
        const responseData: {
          message: string;
          accounts: Account[];
          serverError?: string;
        } = await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        const accounts: Account[] = responseData.accounts;
        dispatch(loadAccounts(accounts));
        dispatch(changeCategorizationActiveAccount(accounts[0]));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

export const addNewAccount =
  (name: string, account_type: AccountType, debit_inc: boolean) =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'POST',
        '/api/accounts',
        {
          name,
          account_type: { label: account_type.name, value: account_type.id },
          debit_inc,
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
        dispatch(fetchAccounts());
        dispatch(fetchAccountTypes('all'));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

export const fetchAccountBalances =
  (accountIds: number[]) => async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/accounts/balances?account_ids=${accountIds}`
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: {
          message: string;
          serverError?: string;
          balances: { [id: number]: number };
        } = await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        const accountBalances = responseData.balances;

        dispatch(updateAccountBalances(accountBalances));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

export const putUpdatedAccountInfo =
  (editedAccount: Account) => async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'PUT',
        '/api/accounts',
        {
          editedAccount,
        }
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: {
          message: string;
          serverError?: string;
          balances: { [id: number]: number };
        } = await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        dispatch(updateAccountInfo(editedAccount));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

export const deleteAccount =
  (accountIDToDelete: number) => async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'DELETE',
        `/api/accounts?id=${accountIDToDelete}`
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: {
          message: string;
          serverError?: string;
          balances: { [id: number]: number };
        } = await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        dispatch(removeAccount(accountIDToDelete));
      } else {
        throw new BadResponseError(
          response.status,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
