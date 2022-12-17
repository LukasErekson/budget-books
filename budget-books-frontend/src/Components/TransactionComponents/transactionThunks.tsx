import {
  setTransactions,
  setTransactionsIsLoaded,
  categorizeTransaction,
} from './transactionSlice';
import DataFetch from '../../Common/DataFetch';
import BadResponseError from '../../Common/BadResponseError';
import Transaction from './transactionTSTypes';
import Account from '../AccountComponents/accountTSTypes';

export const fetchTransactions =
  (account: Account) => async (dispatch: Function) => {
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

export const addTransactionCategory =
  (
    account: Account,
    transaction_id: number,
    category_id: number,
    debit_or_credit: string
  ) =>
  async (dispatch: Function) => {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'PUT',
        `/api/transactions`,
        {
          transactions: [
            {
              transaction_id,
              category_id,
              debit_or_credit: debit_or_credit,
            },
          ],
        }
      );

      const response: Response = await responsePromise;

      if (response.ok) {
        const responseData: any = await response.json();

        const responseDataParsed: any = JSON.parse(responseData);

        if (!(responseDataParsed.message === 'SUCCESS')) {
          throw new BadResponseError(
            response.status,
            responseDataParsed.message,
            responseDataParsed.serverError
          );
        }

        dispatch(setTransactionsIsLoaded({ loaded: false }));
        dispatch(
          categorizeTransaction({
            accountID: account.id,
            transactionID: transaction_id,
            categoryID: category_id,
            debitOrCredit: debit_or_credit,
          })
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error.status, error.message, error.serverError);
    }
  };
