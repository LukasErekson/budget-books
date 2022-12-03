import React, { useState } from 'react';
import DataFetch from '../../Common/DataFetch';
import { pyToJsDate } from '../../Common/TextFilters';
import AccountSelect from '../AccountComponents/AccountSelect';

function CategorizeTxnForm(props: {
  transacitonData: any;
  debitInc: boolean;
  excludeAccount: any;
}): JSX.Element {
  const { id, transaction_date, name, description, amount, debit_account_id } =
    props.transacitonData;

  const isDebitTransaction: boolean = debit_account_id !== 'undefined';

  const amountIsNegative: boolean =
    (isDebitTransaction && !props.debitInc) ||
    (!isDebitTransaction && props.debitInc);

  const [category, setCategory]: [any, Function] = useState({});
  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  async function categorizeTransaction(
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
      } else {
        return { error: 'Problem!' };
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error);
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
        <button onClick={() => categorizeTransaction(id, category.value)}>
          Categorize
        </button>
      </span>
    </div>
  );
}

export default CategorizeTxnForm;
