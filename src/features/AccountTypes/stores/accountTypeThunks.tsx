import { setAccountTypes } from './accountTypeSlice';
import DataFetch from '../../../utils/DataFetch';
import BadResponseError from '../../../utils/BadResponseError';
import AccountType from '../types/types';
import { AppDispatch } from '../../../stores/store';

export const fetchAccountTypes =
  (group: string) => async (dispatch: AppDispatch) => {
    try {
      const {
        responsePromise,
      }: { cancel: () => void; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/accounttypes?group=${group}`
      );

      const response: Response = await responsePromise;
      const responseData: any = await response.json();
      if (response.ok) {
        const accountTypes: any[] = responseData.account_types;

        const accountGroups: string[] = accountTypes.reduce(
          (accumulator: any[], currentValue: AccountType) => {
            if (!accumulator.includes(currentValue.group)) {
              accumulator.push(currentValue.group);
            }

            return accumulator;
          },
          []
        );

        dispatch(setAccountTypes({ accountTypes, accountGroups }));
        return;
      }

      throw new BadResponseError(
        response.status,
        responseData.message,
        responseData.serverError
      );
    } catch (error) {
      console.log(error);
    }
  };
