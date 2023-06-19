import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import Modal from 'react-modal';
import Account from '../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { AccountTypeDropdownSelect } from '../../AccountTypes';
import { useThunkDispatch } from '../../../hooks/hooks';
import { putUpdatedAccountInfo } from '../stores/accountThunks';
import { toast } from 'react-toastify';
import { FiHelpCircle } from 'react-icons/fi';

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
  ] = useState(Boolean(editAccount.debit_inc));

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
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        appElement={document.getElementById('root') || undefined}
        style={{ content: { margin: '2rem', height: '50%' } }}
      >
        <AiOutlineClose
          onClick={props.onRequestClose}
          className='close-modal-x'
        />

        <h1 className='center'>Edit Account</h1>

        <form className={'modal-form'}>
          <label htmlFor='edit-account-name'>Account Name:</label>
          <div className='modal-input'>
            <input
              type='text'
              id={'edit-account-name'}
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
            <label htmlFor='edit-account-debit-inc'>
              Increases with Debits?
            </label>
            <abbr
              title={
                'This is typically true for bank accounts and expenses, but it is not true for credit cards, loans, and other liabilities.'
              }
            >
              <FiHelpCircle />
            </abbr>
            <input
              type='checkbox'
              name='edit-account-debit-inc'
              id='edit-account-debit-inc'
              checked={debitInc}
              onChange={() => setDebitInc(!debitInc)}
            />
          </div>
        </form>
        <div className='center'>
          <button className='modal-btn' onClick={saveAccountEdits}>
            Save
          </button>
          <button className='modal-btn' onClick={props.onRequestClose}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default EditAccountModal;
