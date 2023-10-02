import React, { useState } from 'react';

import { FiHelpCircle } from 'react-icons/fi';

import { Button, Checkbox, TextField } from '@mui/material';
import ModalBase from '../../../components/ModalBase';
import { useThunkDispatch } from '../../../hooks/hooks';
import { AccountTypeDropdownSelect } from '../../AccountTypes';
import { addNewAccount } from '../stores/accountThunks';

import AccountType from '../../AccountTypes/types/types';

function NewAccountModal(props: {
  isOpen: boolean;
  onRequestClose: () => void;
}): JSX.Element {
  const [category, setCategory] = useState<AccountType | null>(null);

  const [accountName, setAccountName] = useState<string>('');

  const [debitInc, setDebitInc] = useState<boolean>(true);

  const thunkDispatch = useThunkDispatch();

  function postNewAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountName.length === 0) {
      alert('Please input an account name!');
      return;
    }

    if (!category) {
      alert('Please ensure you have an account type!');
      return;
    }

    thunkDispatch(addNewAccount(accountName, category, debitInc));

    setAccountName('');

    props.onRequestClose();
  }

  return (
    <>
      <ModalBase
        title={'Add New Account'}
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
      >
        <form
          className='modal-form'
          onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
            postNewAccount(event)
          }
        >
          <label htmlFor='accountName'>Account Name:</label>
          <div>
            <TextField
              id='accountName'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              value={accountName}
              placeholder='Account Name...'
              onChange={(
                event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => setAccountName(event.target.value)}
            />
          </div>
          <br />
          <label htmlFor='accountType'>Category:</label>
          <AccountTypeDropdownSelect
            setValue={setCategory}
            value={category}
            id='accountType'
          />
          <br />
          <div className='modal-input'>
            <label
              htmlFor='debitIncCB'
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
            >
              Balance increases with debits?
              <abbr
                title={
                  'This is typically true for bank accounts and expenses, but it is not true for credit cards, loans, and other liabilities.'
                }
              >
                <FiHelpCircle />
              </abbr>
              <Checkbox
                name='debitInc'
                id='debitIncCB'
                checked={debitInc}
                onChange={(event) => setDebitInc(event.target.checked)}
                sx={{
                  color: '#008cff',
                  '&.Mui-checked': {
                    color: '#008cff',
                  },
                }}
              />
            </label>
          </div>

          <div className='center'>
            <Button variant='contained' type='submit'>
              Add Account
            </Button>
          </div>
        </form>
      </ModalBase>
    </>
  );
}

export default NewAccountModal;
