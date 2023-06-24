import React, { useState } from 'react';
import { useThunkDispatch } from '../../../hooks/hooks';

import { AiOutlineStop, AiOutlinePlus } from 'react-icons/ai';

import { TransactionData } from '../types/types';
import Account from '../../Accounts/types/types';

import dayjs, { Dayjs } from 'dayjs';

import ButtonWithToolTip from '../../../components/ButtonWithToolTip';
import { AccountDropdownSelect } from '../../Accounts';
import { yearMonthDay } from '../../../utils/TextFilters';

import { addTransaction } from '../../Transactions/stores/transactionThunks';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const initialFormData: TransactionData = {
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
    TransactionData,
    React.Dispatch<React.SetStateAction<TransactionData>>
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

    const newTransactionData: TransactionData = { ...formData };

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
        <DatePicker
          slotProps={{
            textField: { size: 'small', style: { marginBottom: '10px' } },
          }}
          className='add-txn-date'
          data-testid='add-txn-date'
          value={dayjs(formData.transaction_date) || null}
          onChange={(newDate: Dayjs | null) => {
            setFormData((prevState: TransactionData) => ({
              ...prevState,
              transaction_date: newDate?.format('YYYY-MM-DD') || '',
            }));
          }}
        />
      </span>{' '}
      <span className='categorize-txn-item'>
        <TextField
          size='small'
          style={{ width: '80%', marginBottom: '10px' }}
          name='txn-name'
          placeholder='Transaction Name'
          value={formData.name}
          onChange={(
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const newName: string = event.target.value;
            setFormData((prevState: TransactionData) => ({
              ...prevState,
              name: newName,
            }));
          }}
        />
      </span>{' '}
      <span className='categorize-txn-item'>
        <TextField
          size='small'
          style={{ width: '80%', marginBottom: '10px' }}
          name='txn-description'
          placeholder='Transaction Description'
          value={formData.description}
          onChange={(
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const newDescription: string = event.target.value;
            setFormData((prevState: TransactionData) => ({
              ...prevState,
              description: newDescription,
            }));
          }}
        />
      </span>{' '}
      <span
        className={
          'categorize-txn-item' +
          (+formData.amount < 0 ? ' negative' : ' positive')
        }
      >
        <TextField
          type='text'
          inputProps={{
            inputMode: 'numeric',
            pattern: '^-?[d(d,)]*.{0,1}[d]{0,2}$',
          }}
          size='small'
          style={{ width: '80%', marginBottom: '10px' }}
          name='txn-amount'
          value={formData.amount === 0 ? '' : formData.amount}
          onChange={(
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const newAmount: string = event.target.value;
            if (/^-?[\d(\d,)]*\.{0,1}[\d]{0,2}$/.test(newAmount)) {
              setFormData((prevState: TransactionData) => ({
                ...prevState,
                amount: newAmount,
              }));
            }
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
          <AiOutlinePlus />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={() => {
            props.setShowAddNewTxn(false);
          }}
          toolTipContent='Close'
          className='add-txn-btn'
        >
          <AiOutlineStop />
        </ButtonWithToolTip>
      </span>
    </div>
  );
}

export default AddTxnForm;
