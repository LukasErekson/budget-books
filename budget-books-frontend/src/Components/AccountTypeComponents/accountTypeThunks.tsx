import { setAccountTypes } from './accountTypeSlice';
import DataFetch from '../../Common/DataFetch';
import BadResponseError from '../../Common/BadResponseError';
import AccountType from './accountTypeTSTypes';

export const fetchAccountTypes =
  (group: string) => async (dispatch: Function) => {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/accounttypes?group=${group}`
      );

      const response: Response = await responsePromise;
      const responseData: any = await response.json();
      if (response.ok) {
        const accountTypes: any[] = JSON.parse(responseData.account_types);

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
