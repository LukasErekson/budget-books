import React, { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { FiHelpCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ModalBase from '../../../components/ModalBase';
import { useThunkDispatch } from '../../../hooks/hooks';
import { RootState } from '../../../stores/store';
import { AccountTypeDropdownSelect } from '../../AccountTypes';
import { deleteAccount, putUpdatedAccountInfo } from '../stores/accountThunks';
import Account from '../types/types';
function EditAccountModal(props: {
  isOpen: boolean;
  onRequestClose: any;
}): JSX.Element {
  const editAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.accountSettingsPage.activeAccount
  );

  const [accountName, setAccountName]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState(editAccount.name);

  const [accountType, setAccountType]: [
    { label: string; value: number },
    React.Dispatch<React.SetStateAction<{ label: string; value: number }>>
  ] = useState({
    label: editAccount.account_type,
    value: editAccount.account_type_id,
  });

  const [accountTypeInput, setAccountTypeInput]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState(editAccount.account_type);

  const [debitInc, setDebitInc]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(Boolean(editAccount.debit_inc) || false);

  const [deleteDialogIsOpen, setDeleteDialogIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const thunkDispatch = useThunkDispatch();

  function saveAccountEdits(): void {
    if (!accountName) {
      toast.error('Cannot save an empty Account Name');
      return;
    }
    const editedAccount: Account = {
      ...editAccount,
      name: accountName,
      account_type: accountType.label,
      account_type_id: accountType.value,
      debit_inc: debitInc,
    };
    thunkDispatch(putUpdatedAccountInfo(editedAccount));
    props.onRequestClose();
  }

  function dispatchDeleteAccount(): void {
    thunkDispatch(deleteAccount(editAccount.id));
    setDeleteDialogIsOpen(false);
    props.onRequestClose();
  }

  useEffect(() => {
    setAccountName(editAccount.name);
    setAccountType({
      label: editAccount.account_type,
      value: editAccount.account_type_id,
    });
    setAccountTypeInput(editAccount.account_type);
    setDebitInc(Boolean(editAccount.debit_inc));
  }, [editAccount]);

  return (
    <>
      <ModalBase
        title='Edit Account'
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
      >
        <Dialog
          open={deleteDialogIsOpen}
          onClose={() => setDeleteDialogIsOpen(false)}
        >
          <DialogTitle>
            Are you sure you want to delete {editAccount.name}?
          </DialogTitle>
          <DialogContent>
            All transactions connected to this account will be moved to
            uncategorized. This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={dispatchDeleteAccount} color='warning'>
              Yes
            </Button>
            <Button onClick={() => setDeleteDialogIsOpen(false)} autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>

        <form className={'modal-form'}>
          <label htmlFor='edit-account-name'>Account Name:</label>
          <div>
            <TextField
              id='edit-account-name'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              value={accountName}
              onChange={(
                event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setAccountName(event.target.value);
              }}
            />
          </div>
          <br />
          <label htmlFor='edit-account-account-type'>Account Type:</label>
          <AccountTypeDropdownSelect
            setCategory={setAccountType}
            category={accountType}
            setInputCategory={setAccountTypeInput}
            inputCategory={accountTypeInput}
            id='edit-account-account-type'
          />
          <br />
          <div className='modal-input'>
            <label
              htmlFor='edit-account-debit-inc'
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
            >
              Increases with Debits?
              <abbr
                title={
                  'This is typically true for bank accounts and expenses, but it is not true for credit cards, loans, and other liabilities.'
                }
              >
                <FiHelpCircle />
              </abbr>
              <Checkbox
                name='edit-account-debit-inc'
                id='edit-account-debit-inc'
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
        </form>
        <div className='center' style={{ display: 'flex', gap: '2rem' }}>
          <Button
            variant='contained'
            onClick={() => {
              setDeleteDialogIsOpen(false);
              saveAccountEdits();
            }}
          >
            Save
          </Button>
          <Button
            variant='contained'
            color='warning'
            onClick={() => setDeleteDialogIsOpen(true)}
          >
            Delete Account
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setDeleteDialogIsOpen(false);
              props.onRequestClose();
            }}
          >
            Close
          </Button>
        </div>
      </ModalBase>
    </>
  );
}

export default EditAccountModal;
