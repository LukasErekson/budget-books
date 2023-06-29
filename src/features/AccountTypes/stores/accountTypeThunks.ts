import { setAccountTypes } from './accountTypeSlice';
import DataFetch from '../../../utils/DataFetch';
import BadResponseError from '../../../utils/BadResponseError';
import AccountType from '../types/types';
import { AppDispatch } from '../../../stores/store';

export const fetchAccountTypes =
  (group = 'all') =>
  async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/accounttypes?group=${group}`
      );

      const response: Response = await responsePromise;
      if (response.ok) {
        const responseData: {
          message: string;
          account_types: AccountType[];
          serverError?: string;
        } = await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error'
          );
        }

        const accountTypes: AccountType[] = responseData.account_types;

        const accountGroups: string[] = [];

        accountTypes.forEach((currentValue: AccountType) => {
          if (!accountGroups.includes(currentValue.group_name)) {
            accountGroups.push(currentValue.group_name);
          }
        });

        dispatch(setAccountTypes({ accountTypes, accountGroups }));
        return;
      }

      throw new BadResponseError(
        response.status,
        'FAILURE',
        'There was an irrecoverable server error.'
      );
    } catch (error) {
      console.log(error);
    }
  };
