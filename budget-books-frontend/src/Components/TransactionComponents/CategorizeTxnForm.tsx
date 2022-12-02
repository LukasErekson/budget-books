import React, { useState } from 'react';
import { pyToJsDate } from '../../Common/TextFilters';
import AccountSelect from '../AccountComponents/AccountSelect';

function CategorizeTxnForm(props: { transacitonData: any }): JSX.Element {
  const { id, transaction_date, name, description, amount } =
    props.transacitonData;

  const [category, setCategory]: [any, Function] = useState({});
  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  return (
    <div className='categorize-txn-form' key={id}>
      <span className='categorize-txn-item'>
        {pyToJsDate(transaction_date)}
      </span>{' '}
      <span className='categorize-txn-item'>{name}</span>{' '}
      <span className='categorize-txn-item'>{description}</span>{' '}
      <span className='categorize-txn-item'>${amount}</span>
      <span className='categorize-txn-item'>
        <AccountSelect
          setCategory={setCategory}
          category={category}
          setInputCategory={setInputCategory}
          inputCategory={inputCategory}
        />
      </span>
      <span className='categorize-txn-item'>
        <button>Categorize</button>
      </span>
    </div>
  );
}

export default CategorizeTxnForm;
