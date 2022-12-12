import { setTransactions, setTransactionsIsLoaded } from './transactionSlice';
import DataFetch from '../../Common/DataFetch';
import BadResponseError from '../../Common/BadResponseError';
import Transaction from './transactionTSTypes';
import Account from '../AccountComponents/accountTSTypes';
import { RootState } from '../../store';

export const fetchTransactions =
  (account: Account) => async (dispatch: Function, state: RootState) => {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/transactions?account_ids=${account.id}`
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: any = await response.json();

        const payload: { transactions: Transaction[] } = {
          transactions: JSON.parse(responseData.transactions),
        };
        dispatch(setTransactions(payload));
        dispatch(setTransactionsIsLoaded({ loaded: true }));
      } else {
        throw new BadResponseError(response.status, 'Bad status', 'bad status');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error);
    }
  };
