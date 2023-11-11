import React, { useState } from 'react';
import Transaction from '../types/types';
import ModalBase from '../../../components/ModalBase';
import { Button, FormControl, InputLabel, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useThunkDispatch } from '../../../hooks/hooks';
import { editTransaction } from '../stores/transactionThunks';
import { AccountDropdownSelect } from '../../Accounts';
import Account from '../../Accounts/types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { selectAccounts } from '../../Accounts/stores/accountSelectors';

const newAccount: Account = {
  name: '',
  id: -1,
  account_group: 'Create New Account',
  account_type: 'New Account',
  account_type_id: -1,
  debit_inc: true,
  balance: 0,
  last_updated: '',
};

function EditTransactionModal(props: {
  isOpen: boolean;
  onRequestClose: () => void;
  transaction: Transaction;
}): JSX.Element {
  const transactionToEdit: Transaction = props.transaction;

  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  const debitAccount: Account | null = transactionToEdit.debit_account_id
    ? accounts.filter(
        (acc: Account) => acc.id === transactionToEdit.debit_account_id
      )[0]
    : null;

  const creditAccount: Account | null = transactionToEdit.credit_account_id
    ? accounts.filter(
        (acc: Account) => acc.id === transactionToEdit.credit_account_id
      )[0]
    : null;

  const [date, setDate] = useState<string>(transactionToEdit.transaction_date);
  const [name, setName] = useState<string>(transactionToEdit.name);
  const [description, setDescription] = useState<string>(
    transactionToEdit.description
  );
  const [amount, setAmount] = useState<string>(
    transactionToEdit.amount.toString() || '0'
  );

  const [transactionDebitAccount, setTransactionDebitAccount] =
    useState<Account | null>(debitAccount);
  const [debitAccountInput, setDebitAccountInput] = useState<string>(
    debitAccount?.name || ''
  );

  const [transactionCreditAccount, setTransactionCreditAccount] =
    useState<Account | null>(creditAccount);
  const [creditAccountInput, setCreditAccountInput] = useState<string>(
    creditAccount?.name || ''
  );
  const dispatch = useThunkDispatch();

  function saveUpdates() {
    const updatedTransaction: Transaction = {
      ...transactionToEdit,
      name: name,
      transaction_date: date,
      description: description,
      debit_account_id: transactionDebitAccount
        ? +transactionDebitAccount.id
        : 'undefined',
      credit_account_id: transactionCreditAccount
        ? +transactionCreditAccount.id
        : 'undefined',
    };

    updatedTransaction.amount = +amount.toString().replace(/[^0-9\-.]/g, '');

    dispatch(editTransaction(updatedTransaction));

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
            excludeAccount={transactionCreditAccount}
            value={transactionDebitAccount}
            setValue={(newAccount: Account) =>
              setTransactionDebitAccount(newAccount)
            }
            inputValue={debitAccountInput}
            setInputValue={(newValue: string) => setDebitAccountInput(newValue)}
            label='Debit Account'
          />

          <AccountDropdownSelect
            excludeAccount={transactionDebitAccount}
            value={transactionCreditAccount}
            setValue={(newAccount: Account) =>
              setTransactionCreditAccount(newAccount)
            }
            setInputValue={(newValue: string) =>
              setCreditAccountInput(newValue)
            }
            inputValue={creditAccountInput}
            label='Credit Account'
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
