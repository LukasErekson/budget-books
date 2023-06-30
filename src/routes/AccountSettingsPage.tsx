import React, { useState } from 'react';
import AccountList from '../features/Accounts/components/AccountList';
import { NewAccountModal } from '../features/Accounts';
import EditAccountModal from '../features/Accounts/components/EditAccountModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { closeEditAccountModal } from '../stores/PageSlice';
import { Button, TextField } from '@mui/material';
import NewAccountTypeModal from '../features/AccountTypes/components/NewAccountTypeModal';

function AccountSettingsPage(): JSX.Element {
  const editAccountModalIsOpen: boolean = useSelector(
    (state: RootState) =>
      state.pageSlice.accountSettingsPage.editAccountModalIsOpen
  );

  const dispatch = useDispatch();

  const [newAccountModalIsOpen, setNewAccountModalIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const [newAccountTypeModalIsOpen, setNewAccountTypeModalIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  return (
    <>
      <h1>Account Settings Page</h1>

      <NewAccountModal
        isOpen={newAccountModalIsOpen}
        onRequestClose={() => setNewAccountModalIsOpen(false)}
      />

      <EditAccountModal
        isOpen={editAccountModalIsOpen}
        onRequestClose={() => dispatch(closeEditAccountModal())}
      />

      <NewAccountTypeModal
        isOpen={newAccountTypeModalIsOpen}
        onRequestClose={() => setNewAccountTypeModalIsOpen(false)}
      />

      <TextField size='small' disabled={true} />

      <Button
        variant='contained'
        onClick={() => setNewAccountModalIsOpen(true)}
      >
        Add new account
      </Button>

      <Button
        variant='contained'
        onClick={() => setNewAccountTypeModalIsOpen(true)}
      >
        Add new Account Type
      </Button>

      <div className='center'>
        <AccountList />
      </div>
    </>
  );
}

export default AccountSettingsPage;
