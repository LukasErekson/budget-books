import React, { useState } from 'react';
import {
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentPlus,
} from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import ButtonWithToolTip from '../components/ButtonWithToolTip';
import NewAccountTypeModal from '../features/AccountTypes/components/NewAccountTypeModal';
import { NewAccountModal } from '../features/Accounts';
import AccountList from '../features/Accounts/components/AccountList';
import EditAccountModal from '../features/Accounts/components/EditAccountModal';
import { closeEditAccountModal } from '../stores/PageSlice';
import { RootState } from '../stores/store';
import { TextField } from '@mui/material';

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

      <div className='acct-table-controls'>
        <TextField size='small' disabled />
        <ButtonWithToolTip
          toolTipContent={'Add New Account'}
          onClick={() => setNewAccountModalIsOpen(true)}
        >
          <HiOutlineDocumentPlus />
        </ButtonWithToolTip>
        <ButtonWithToolTip
          toolTipContent={'Add New Account Type'}
          onClick={() => setNewAccountTypeModalIsOpen(true)}
        >
          <HiOutlineDocumentDuplicate />
        </ButtonWithToolTip>
      </div>

      <div className='center'>
        <AccountList />
      </div>
    </>
  );
}

export default AccountSettingsPage;
