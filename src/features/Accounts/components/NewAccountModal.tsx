import React, { useState } from 'react';

import Modal from 'react-modal';

import { FiHelpCircle } from 'react-icons/fi';

import { addNewAccount } from '../stores/accountThunks';
import { useThunkDispatch } from '../../../hooks/hooks';
import { AccountTypeDropdownSelect } from '../../AccountTypes';
import { AiOutlineClose } from 'react-icons/ai';
import { Button, Checkbox, TextField } from '@mui/material';

function NewAccountModal(props: {
  isOpen: boolean;
  onRequestClose: any;
}): JSX.Element {
  const [category, setCategory]: [
    { label: string; value: number },
    React.Dispatch<React.SetStateAction<{ label: string; value: number }>>
  ] = useState({ label: 'Misc. Accounts', value: -1 } as {
    label: string;
    value: number;
  });
  const [inputCategory, setInputCategory]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState('Misc. Accounts');

  const [accountName, setAccountName]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState('');

  const [debitInc, setDebitInc]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(true);

  const thunkDispatch = useThunkDispatch();

  function postNewAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountName.length === 0) {
      alert('Please input an account name!');
      return;
    }

    thunkDispatch(addNewAccount(accountName, category, debitInc));

    setAccountName('');

    props.onRequestClose();
  }

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        appElement={document.getElementById('root') || undefined}
        style={{ content: { margin: '2rem', height: '50%' } }}
      >
        <div className='close-modal-x'>
          <Button onClick={props.onRequestClose}>
            <AiOutlineClose />
          </Button>
        </div>
        <h1 className='center'>Add New Account</h1>
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
            setCategory={setCategory}
            category={category}
            setInputCategory={setInputCategory}
            inputCategory={inputCategory}
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
      </Modal>
    </>
  );
}

export default NewAccountModal;
