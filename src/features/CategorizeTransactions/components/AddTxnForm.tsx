import React, { useState } from 'react';
import { useThunkDispatch } from '../../../hooks/hooks';

import { AiOutlineStop, AiOutlinePlus } from 'react-icons/ai';

import { transactionData } from '../types/types';
import Account from '../../Accounts/types/types';

import ButtonWithToolTip from '../../../components/ButtonWithToolTip';
import { AccountDropdownSelect } from '../../Accounts';
import { yearMonthDay } from '../../../utils/TextFilters';

import { addTransaction } from '../../Transactions/stores/transactionThunks';

const initialFormData: transactionData = {
  transaction_date: yearMonthDay(new Date()),
  name: '',
  description: '',
  amount: 0,
};

function AddTxnForm(props: {
  debitInc: boolean;
  account: Account;
  setShowAddNewTxn: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const id = -1;
  const [formData, setFormData]: [
    transactionData,
    React.Dispatch<React.SetStateAction<transactionData>>
  ] = useState(initialFormData);

  const thunkDispatch = useThunkDispatch();

  const [category, setCategory]: [
    { label: string; value: number },
    React.Dispatch<React.SetStateAction<{ label: string; value: number }>>
  ] = useState({
    label: '',
    value: -1,
  });

  const [inputCategory, setInputCategory]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState('');

  function postTransaction() {
    for (const val of Object.values(formData)) {
      if (!val) {
        return;
      }
    }

    const newTransactionData: transactionData = { ...formData };

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
      <span />
      <span className='categorize-txn-item'>
        <input
          type='date'
          data-testid='add-txn-date'
          name='add-txn-date'
          value={formData.transaction_date}
          onChange={(event: any) => {
            const newDate: string = event.target.value;
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
            const newName: string = event.target.value;
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
            const newDescription: string = event.target.value;
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
            const newAmount: string = event.target.value;
            setFormData((prevState: transactionData) => ({
              ...prevState,
              amount: newAmount,
            }));
          }}
        />
      </span>
      <span className='categorize-txn-item'>
        <AccountDropdownSelect
          setCategory={setCategory}
          category={category}
          setInputCategory={setInputCategory}
          inputCategory={inputCategory}
          excludeAccount={props.account}
        />
      </span>
      <span className='categorize-txn-item add-txn-controls'>
        <ButtonWithToolTip
          onClick={postTransaction}
          toolTipContent='Post Transaction'
          className='add-txn-btn'
        >
          <AiOutlinePlus style={{ fontSize: '1.25rem' }} />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={() => {
            props.setShowAddNewTxn(false);
          }}
          toolTipContent='Close'
          className='add-txn-btn'
        >
          <AiOutlineStop style={{ fontSize: '1.25rem' }} />
        </ButtonWithToolTip>
      </span>
    </div>
  );
}

export default AddTxnForm;
