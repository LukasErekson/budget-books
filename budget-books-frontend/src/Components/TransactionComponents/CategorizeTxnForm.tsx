import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import BadResponseError from '../../Common/BadResponseError';
import DataFetch from '../../Common/DataFetch';
import { pyToJsDate } from '../../Common/TextFilters';
import AccountSelect from '../AccountComponents/AccountSelect';
import Account from '../AccountComponents/accountTSTypes';
import {
  categorizeTransaction,
  setTransactionsIsLoaded,
} from './transactionSlice';
import Transaction from './transactionTSTypes';

function CategorizeTxnForm(props: {
  transacitonData: Transaction;
  debitInc: boolean;
  excludeAccount: Account;
}): JSX.Element {
  const { id, transaction_date, name, description, amount, debit_account_id } =
    props.transacitonData;

  const isDebitTransaction: boolean = debit_account_id !== 'undefined';

  const amountIsNegative: boolean =
    (isDebitTransaction && !props.debitInc) ||
    (!isDebitTransaction && props.debitInc);

  const [category, setCategory]: [any, Function] = useState({});
  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  const dispatch = useDispatch();

  async function postCategorizeTransaction(
    transaction_id: number,
    category_id: number
  ) {
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
              debit_or_credit: isDebitTransaction ? 'credit' : 'debit', // Flipped because if it's a debit transaction, then the credit ID is undefined.
            },
          ],
        }
      );

      const response = await responsePromise;

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
            accountID: props.excludeAccount.id,
            transactionID: transaction_id,
            categoryID: category_id,
            debitOrCredit: isDebitTransaction ? 'credit' : 'debit',
          })
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error.status, error.message, error.serverError);
    }
  }

  return (
    <div className='categorize-txn-form' key={id}>
      <span className='categorize-txn-item'>
        {pyToJsDate(transaction_date)}
      </span>{' '}
      <span className='categorize-txn-item'>{name}</span>{' '}
      <span className='categorize-txn-item'>{description}</span>{' '}
      <span
        className={
          'categorize-txn-item' + (amountIsNegative ? ' negative' : ' positive')
        }
      >
        {amountIsNegative && '-'}${amount}
      </span>
      <span className='categorize-txn-item'>
        <AccountSelect
          setCategory={setCategory}
          category={category}
          setInputCategory={setInputCategory}
          inputCategory={inputCategory}
          excludeAccount={props.excludeAccount}
        />
      </span>
      <span className='categorize-txn-item'>
        <button onClick={() => postCategorizeTransaction(id, category.value)}>
          Categorize
        </button>
      </span>
    </div>
  );
}

export default CategorizeTxnForm;
