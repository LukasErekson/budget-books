import React, { useState } from 'react';
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
        <button>Categorize</button>
      </span>
    </div>
  );
}

export default CategorizeTxnForm;
