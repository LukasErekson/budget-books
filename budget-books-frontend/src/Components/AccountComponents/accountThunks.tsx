import { loadAccounts } from './accountSlice';
import DataFetch from '../../Common/DataFetch';
import BadResponseError from '../../Common/BadResponseError';

export const fetchAllAccounts =
    () => async (dispatch: Function, getState: Function) => {
        try {
            const {
                responsePromise,
            }: { cancel: Function; responsePromise: Promise<Response> } =
                DataFetch('GET', '/api/accounts?account_type=all');

            const response: Response = await responsePromise;
            if (response.ok) {
                const responseData: any = await response.json();
                const accounts: any[] = JSON.parse(responseData.accounts);
                dispatch(loadAccounts(accounts));
            }
        } catch (error) {
            console.log(error);
        }
    };

export const addNewAccount =
    (name: string, account_type: string, debit_inc: boolean) =>
    async (dispatch: Function, getState: Function) => {
        try {
            const {
                responsePromise,
            }: { cancel: Function; responsePromise: Promise<Response> } =
                DataFetch('POST', '/api/accounts', {
                    name,
                    account_type,
                    debit_inc,
                });

            const response: Response = await responsePromise;
            if (response.ok) {
                dispatch(fetchAllAccounts());
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
