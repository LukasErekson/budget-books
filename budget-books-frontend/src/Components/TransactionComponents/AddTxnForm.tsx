import React, { useState } from 'react';

import { yearMonthDay } from '../../Common/TextFilters';
import { transactionData } from './transactionTSTypes';

import AccountSelect from '../AccountComponents/AccountSelect';
import Account from '../AccountComponents/accountTSTypes';

import { useThunkDispatch } from '../../hooks';
import { addTransaction } from './transactionThunks';

import { AiOutlineCloseCircle, AiOutlinePlusCircle } from 'react-icons/ai';

function AddTxnForm(props: {
  debitInc: boolean;
  account: Account;
  setShowAddNewTxn: Function;
}): JSX.Element {
  const id = -1;
  const [formData, setFormData]: [transactionData, Function] = useState({
    transaction_date: yearMonthDay(new Date()),
    name: '',
    description: '',
    amount: 0,
  });

  const thunkDispatch = useThunkDispatch();

  const [category, setCategory]: [{ label: string; value: number }, Function] =
    useState({
      label: '',
      value: -1,
    });

  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  function postTransaction() {
    for (let val of Object.values(formData)) {
      if (!val) {
        return;
      }
    }

    let newTransactionData: transactionData = { ...formData };

    // Convert to an actual number
    newTransactionData.amount = +newTransactionData.amount
      .toString()
      .replace(/[^0-9\-.]/g, '');

    if (newTransactionData.amount < 0) {
      newTransactionData.credit_account_id = props.account.id;
      newTransactionData.debit_account_id = category.label
        ? category.value
        : undefined;
    } else {
      newTransactionData.debit_account_id = props.account.id;
      newTransactionData.credit_account_id = category.label
        ? category.value
        : undefined;
    }

    newTransactionData.amount = Math.abs(newTransactionData.amount).toFixed(2);

    thunkDispatch(addTransaction(props.account, newTransactionData));
    props.setShowAddNewTxn(false);
  }

  return (
    <div className='categorize-txn-form' key={id}>
      <span className='categorize-txn-item'>
        <input
          type='date'
          name='add-txn-date'
          value={formData.transaction_date}
          onChange={(event: any) => {
            let newDate: string = event.target.value;
            setFormData((prevState: transactionData) => ({
              ...prevState,
              transaction_date: newDate,
            }));
          }}
        />
      </span>{' '}
      <span className='categorize-txn-item'>
        <input
          type='text'
          name='txn-name'
          style={{ width: '80%' }}
          placeholder='Transaction Name'
          value={formData.name}
          onChange={(event: any) => {
            let newName: string = event.target.value;
            setFormData((prevState: transactionData) => ({
              ...prevState,
              name: newName,
            }));
          }}
        />
      </span>{' '}
      <span className='categorize-txn-item'>
        <input
          type='text'
          name='txn-description'
          style={{ width: '80%' }}
          placeholder='Transaction Description'
          value={formData.description}
          onChange={(event: any) => {
            let newDescription: string = event.target.value;
            setFormData((prevState: transactionData) => ({
              ...prevState,
              description: newDescription,
            }));
          }}
        />
      </span>{' '}
      <span
        className={
          'categorize-txn-item' +
          (formData.amount < 0 ? ' negative' : ' positive')
        }
      >
        <input
          type='text'
          name='txn-amount'
          style={{ width: '80%' }}
          value={formData.amount === 0 ? '' : formData.amount}
          onChange={(event: any) => {
            let newAmount: string = event.target.value;
            setFormData((prevState: transactionData) => ({
              ...prevState,
              amount: newAmount,
            }));
          }}
        />
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
      <span className='categorize-txn-item add-txn-controls'>
        <button className='add-txn-btn' onClick={postTransaction}>
          <AiOutlinePlusCircle style={{ fontSize: '1.5rem' }} />
        </button>
        <button
          className='add-txn-btn'
          onClick={() => props.setShowAddNewTxn(false)}
        >
          <AiOutlineCloseCircle style={{ fontSize: '1.5rem' }} />
        </button>
      </span>
    </div>
  );
}

export default AddTxnForm;
