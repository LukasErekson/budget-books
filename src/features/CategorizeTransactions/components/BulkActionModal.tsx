import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { IoMdWarning } from 'react-icons/io';

import Account from '../../Accounts/types/types';
import Transaction from '../../Transactions/types/types';

import { Button } from '@mui/material';
import ModalBase from '../../../components/ModalBase';
import { useThunkDispatch } from '../../../hooks/hooks';
import { RootState } from '../../../stores/store';
import { AccountDropdownSelect } from '../../Accounts';
import { addNewAccount } from '../../Accounts/stores/accountThunks';
import {
  addManyTransactionCategories,
  deleteTransactions,
} from '../../Transactions/stores/transactionThunks';

type BulkActionModalProps = {
  isOpen: boolean;
  onRequestClose:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | any;
  selectedTransactions: Transaction[];
  removeSelectedTransactions: (arg0: Transaction[]) => void; // For cleaning up upon submit.
};

function BulkActionModal(props: BulkActionModalProps): JSX.Element {
  const thunkDispatch = useThunkDispatch();

  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.categorizationPage.activeAccount
  );

  const relevantSelectedTransactions: Transaction[] =
    props.selectedTransactions.filter(
      (transaction) =>
        transaction.debit_account_id === activeAccount.id ||
        transaction.credit_account_id === activeAccount.id
    );

  const [category, setCategory] = useState<Account>({} as Account);

  const [inputCategory, setInputCategory] = useState<string>('New Account');

  // Clean up selected Transactions/close the modal on compelted
  // action.
  function bulkActionComplete(toastId?: number) {
    // Remove transactions that have been posted
    props.removeSelectedTransactions(relevantSelectedTransactions);

    props.onRequestClose();
  }

  function postCategorizeTransactions() {
    if (category.id === -1) {
      thunkDispatch(
        addNewAccount(
          category.name,
          {
            name: category.account_type,
            id: category.account_type_id,
            group_name: 'Misc.',
          },
          true
        )
      );
    }

    thunkDispatch(
      addManyTransactionCategories(
        activeAccount,
        relevantSelectedTransactions,
        category.id
      )
    );

    bulkActionComplete();
  }

  function deleteAllTransactions() {
    thunkDispatch(deleteTransactions(relevantSelectedTransactions));

    bulkActionComplete();
  }

  return (
    <ModalBase
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      title='Bulk Actions'
      portalClassName='bulk-txn-modal'
    >
      <h4>
        The following will apply the action to{' '}
        <span className='alert'>{relevantSelectedTransactions.length}</span>{' '}
        selected transaction
        {relevantSelectedTransactions.length === 1 ? '' : 's'} for{' '}
        <span className='alert'>{activeAccount.name}</span>
      </h4>

      <div className='bulk-action-form'>
        <div className='bulk-action-group'>
          <h5 className='bulk-action-header'>Categorize:</h5>
          <div className='bulk-categorize-form'>
            <AccountDropdownSelect
              value={category}
              setValue={setCategory}
              inputValue={inputCategory}
              setInputValue={setInputCategory}
              excludeAccount={activeAccount}
            />
            <button
              className='add-txn-btn bulk-add-txn-btn'
              onClick={postCategorizeTransactions}
            >
              Categorize
            </button>
          </div>
        </div>
        <div className='bulk-action-group'>
          <h5 className='bulk-action-header'>Delete:</h5>
          <div className='bulk-delete-form'>
            <p className='warn center'>
              <IoMdWarning style={{ fontSize: '2rem', margin: '-.5rem' }} />
            </p>
            <p className='warn center'>
              By hitting &quot;Delete All&quot; below, you are deleting all of
              the selected transactions. There is no undoing this action.
            </p>
            <div className='delete-modal-options'>
              <Button
                variant='contained'
                color='warning'
                onClick={() => {
                  deleteAllTransactions();
                }}
              >
                Delete All
              </Button>
              <Button variant='contained' onClick={props.onRequestClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}

export default BulkActionModal;
