import { loadAccounts } from './accountSlice';
import DataFetch from '../../Common/DataFetch';

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
