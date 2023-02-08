import { loadAccounts, updateAccountBalances } from './accountSlice';
import DataFetch from '../../../utils/DataFetch';
import BadResponseError from '../../../utils/BadResponseError';
import { fetchAccountTypes } from '../../AccountTypes/stores/accountTypeThunks';
import Account from '../types/types';
import { AppDispatch } from '../../../stores/store';

export const fetchAccounts =
  (accountType: string = 'all') =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/accounts?account_type=${accountType}`
      );

      const response: Response = await responsePromise;
      if (response.ok) {
        const responseData: any = await response.json();
        const accounts: Account[] = JSON.parse(responseData.accounts);
        dispatch(loadAccounts(accounts));
      }
    } catch (error) {
      console.log(error);
    }
  };

export const addNewAccount =
  (name: string, account_type: any, debit_inc: boolean) =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
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
        dispatch(fetchAccounts());
        dispatch(fetchAccountTypes('all'));
      } else {
        const responseData: any = await response.json();
        throw new BadResponseError(
          response.status,
          responseData.message,
          responseData.serverError
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
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/accounts/balances?account_ids=${accountIds}`
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const accountBalances: { [id: number]: number } = await response.json();

        dispatch(updateAccountBalances(accountBalances));
      } else {
        const responseData: any = await response.json();
        throw new BadResponseError(
          response.status,
          responseData.message,
          responseData.serverError
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
