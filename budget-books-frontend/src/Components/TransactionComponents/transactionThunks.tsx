import { setTransactions, setTransactionsIsLoaded } from './transactionSlice';
import DataFetch from '../../Common/DataFetch';
import BadResponseError from '../../Common/BadResponseError';

export const fetchTransactions =
  (account: any) => async (dispatch: Function, state: any) => {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/transactions?account_ids=${account.id}`
      );

      const response = await responsePromise;

      if (response.ok) {
        const responseData: any = await response.json();

        const payload: any = {
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
