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
import AccountType from '../../AccountTypes/types/types';

function EditAccountModal(props: {
  isOpen: boolean;
  onRequestClose: () => void;
}): JSX.Element {
  const editAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.accountSettingsPage.activeAccount
  );

  const [accountName, setAccountName] = useState<string>(editAccount.name);

  const [accountType, setAccountType] = useState<AccountType | null>(null);

  const [debitInc, setDebitInc] = useState<boolean>(
    Boolean(editAccount.debit_inc)
  );

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false);

  const thunkDispatch = useThunkDispatch();

  function saveAccountEdits(): void {
    if (!accountName) {
      toast.error('Cannot save an empty Account Name');
      return;
    }

    if (!accountType) {
      toast.error('Must have a valid account type');
      return;
    }

    const editedAccount: Account = {
      ...editAccount,
      name: accountName,
      account_type: accountType.name,
      account_type_id: +accountType.id,
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
      name: editAccount.account_type,
      id: editAccount.account_type_id,
      group_name: editAccount.account_group,
    });
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
              value={accountName || ''}
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
            setValue={setAccountType}
            value={accountType}
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
                checked={debitInc == undefined ? false : debitInc}
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
