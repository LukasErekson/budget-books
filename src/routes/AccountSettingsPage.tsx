import React, { useState } from 'react';
import AccountList from '../features/Accounts/components/AccountList';
import { NewAccountModal } from '../features/Accounts';
import EditAccountModal from '../features/Accounts/components/EditAccountModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import Account from '../features/Accounts/types/types';
import { closeEditAccountModal } from '../stores/PageSlice';

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

      <button onClick={() => setNewAccountModalIsOpen(true)}>
        Add new account
      </button>
      <div className='center'>
        <AccountList />
      </div>
    </>
  );
}

export default AccountSettingsPage;
