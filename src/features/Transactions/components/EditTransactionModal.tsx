import React, { useState } from 'react';
import Transaction from '../types/types';
import ModalBase from '../../../components/ModalBase';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useThunkDispatch } from '../../../hooks/hooks';
import { editTransaction } from '../stores/transactionThunks';
import { AccountDropdownSelect } from '../../Accounts';
import Account from '../../Accounts/types/types';

function EditTransactionModal(props: {
  isOpen: boolean;
  onRequestClose: () => void;
  transaction: Transaction;
}): JSX.Element {
  const transactionToEdit: Transaction = props.transaction;

  const [date, setDate] = useState<string>(transactionToEdit.transaction_date);
  const [name, setName] = useState<string>(transactionToEdit.name);
  const [description, setDescription] = useState<string>(
    transactionToEdit.description
  );
  const [amount, setAmount] = useState<string>(
    transactionToEdit.amount.toString() || '0'
  );

  const dispatch = useThunkDispatch();

  function saveUpdates() {
    const updatedTransaction: Transaction = {
      ...transactionToEdit,
      name: name,
      transaction_date: date,
      description: description,
    };

    updatedTransaction.amount = +amount.toString().replace(/[^0-9\-.]/g, '');

    dispatch(editTransaction(updatedTransaction));

    console.log(updatedTransaction);

    props.onRequestClose();
  }

  return (
    <ModalBase
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      title='Edit Transaction'
      portalClassName='edit-txn-modal'
    >
      <div className='edit-transaction-container'>
        <div className='edit-transaction-top-row'>
          <DatePicker
            label={'Transaction Date'}
            value={dayjs(date)}
            onChange={(newValue: Dayjs | null) => {
              if (newValue) {
                setDate(newValue?.format('YYYY-MM-DD'));
              }
            }}
          />
          <TextField
            value={name}
            label={'Name'}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label='Amount'
            inputProps={{
              inputMode: 'numeric',
              pattern: '[^A-Za-zs]+',
              'aria-invalid': !/[^A-Za-z\s]+/.test(amount),
            }}
            name='txn-amount'
            value={+amount === 0 ? '' : amount}
            onChange={(
              event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              const newAmount: string = event.target.value;
              if (/^-?[\d,)]*\.{0,1}[\d]{0,2}$/.test(newAmount)) {
                setAmount(newAmount);
              }
            }}
          />
        </div>
        <TextField
          value={description}
          label={'Description'}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          rows={4}
        />
        <div className='edit-transaction-accounts'>
          <AccountDropdownSelect
            excludeAccount={{} as Account}
            value={{} as Account}
            setValue={() => {}}
            setInputValue={() => {}}
            inputValue=''
          />
          <AccountDropdownSelect
            excludeAccount={{} as Account}
            value={{} as Account}
            setValue={() => {}}
            setInputValue={() => {}}
            inputValue=''
          />
        </div>
        <div className='edit-transaction-buttons'>
          <Button onClick={() => props.onRequestClose()} variant='contained'>
            Cancel
          </Button>
          <Button onClick={saveUpdates} variant='contained'>
            Save
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}

export default EditTransactionModal;
