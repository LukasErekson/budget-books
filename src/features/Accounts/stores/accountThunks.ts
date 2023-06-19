import {
  loadAccounts,
  updateAccountBalances,
  updateAccountInfo,
} from './accountSlice';
import DataFetch from '../../../utils/DataFetch';
import BadResponseError from '../../../utils/BadResponseError';
import { fetchAccountTypes } from '../../AccountTypes/stores/accountTypeThunks';
import Account from '../types/types';
import { AppDispatch } from '../../../stores/store';

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
  (
    name: string,
    account_type: { label: string; value: number },
    debit_inc: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'POST',
        '/api/accounts',
        {
          name,
          account_type,
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
