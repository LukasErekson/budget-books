import React, { useState } from 'react';
import { pyToJsDate } from '../../Common/TextFilters';
import AccountSelect from '../AccountComponents/AccountSelect';
import Account from '../AccountComponents/accountTSTypes';
import { addNewAccount } from '../AccountComponents/accountThunks';
import Transaction from './transactionTSTypes';
import { useThunkDispatch } from '../../hooks';
import { addTransactionCategory } from './transactionThunks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectAccounts } from '../AccountComponents/accountSelectors';

function CategorizeTxnForm(props: {
  transacitonData: Transaction;
  debitInc: boolean;
  account: Account;
}): JSX.Element {
  const { id, transaction_date, name, description, amount, debit_account_id } =
    props.transacitonData;

  const isDebitTransaction: boolean = debit_account_id !== 'undefined';

  const amountIsNegative: boolean =
    (isDebitTransaction && props.debitInc) ||
    (!isDebitTransaction && !props.debitInc);

  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  let firstAccountIdx: number = 0;

  if (accounts.indexOf(props.account) === 0) {
    firstAccountIdx = 1;
  }

  const [category, setCategory]: [{ label: string; value: number }, Function] =
    useState({
      label: accounts[firstAccountIdx].name,
      value: accounts[firstAccountIdx].id,
    });

  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  const thunkDispatch = useThunkDispatch();

  function postCategorizeTransaction(
    transaction_id: number,
    category_id: number
  ) {
    if (category_id === -1) {
      thunkDispatch(addNewAccount(category.label, category, true));
    }

    thunkDispatch(
      addTransactionCategory(
        props.account,
        transaction_id,
        category_id,
        isDebitTransaction ? 'credit' : 'debit' // Flipped for what needs to be categorized.
      )
    );
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
          excludeAccount={props.account}
        />
      </span>
      <span className='categorize-txn-item'>
        <button
          className='categorize-txn-btn'
          onClick={() => postCategorizeTransaction(id, category.value)}
        >
          Add
        </button>
      </span>
    </div>
  );
}

export default CategorizeTxnForm;