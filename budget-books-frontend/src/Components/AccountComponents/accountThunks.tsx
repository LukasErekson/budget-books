import { loadAccounts } from './accountSlice';
import DataFetch from '../../Common/DataFetch';
import BadResponseError from '../../Common/BadResponseError';
import { fetchAccountTypes } from '../AccountTypeComponents/accountTypeThunks';
import Account from './accountTSTypes';
import { AppDispatch } from '../../store';

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
