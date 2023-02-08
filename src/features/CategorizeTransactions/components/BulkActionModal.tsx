import React, { FC, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdWarning } from 'react-icons/io';

import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { useThunkDispatch } from '../../../hooks/hooks';
import { RootState } from '../../../stores/store';
import AccountDropdownSelect from '../../Accounts/components/AccountDropdownSelect';
import { addNewAccount } from '../../Accounts/stores/accountThunks';
import Account from '../../Accounts/types/types';
import {
  addManyTransactionCategories,
  deleteTransactions,
} from '../../Transactions/stores/transactionThunks';
import Transaction from '../../Transactions/types/types';

type BulkActionModalProps = {
  isOpen: boolean;
  onRequestClose:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | any;
  selectedTransactions: Transaction[];
  removeSelectedTransactions: Function; // For cleaning up upon submit.
};

const BulkActionModal: FC<BulkActionModalProps> = (
  props: BulkActionModalProps
): JSX.Element => {
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

  const [category, setCategory]: [{ label: string; value: number }, Function] =
    useState({ label: '', value: -2 });

  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  // Clean up selected Transactions/close the modal on compelted
  // action.
  function bulkActionComplete() {
    // Remove transactions that have been posted
    relevantSelectedTransactions.forEach((transaction: Transaction) => {
      props.removeSelectedTransactions(transaction);
    });

    props.onRequestClose();
  }

  function postCategorizeTransactions() {
    if (category.value === -1) {
      thunkDispatch(addNewAccount(category.label, category, true));
    }

    thunkDispatch(
      addManyTransactionCategories(
        activeAccount,
        relevantSelectedTransactions,
        category.value
      )
    );

    bulkActionComplete();
  }

  function deleteAllTransactions() {
    thunkDispatch(deleteTransactions(relevantSelectedTransactions));

    bulkActionComplete();
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      appElement={document.getElementById('root') || undefined}
      style={{
        content: {
          height: '50%',
          width: '50%',
          margin: 'auto',
          marginRight: 'auto',
        },
      }}
      portalClassName='bulk-txn-modal'
    >
      <AiOutlineClose
        onClick={props.onRequestClose}
        className='close-modal-x'
      />
      <h3>Bulk Actions</h3>
      <h4>
        The following will apply the action to{' '}
        <span className='alert'>{relevantSelectedTransactions.length}</span>{' '}
        selected transaction
        {relevantSelectedTransactions.length === 1 ? '' : 's'} for{' '}
        <span className='alert'>{activeAccount.name}</span>
      </h4>

      <div className='bulk-action-form'>
        <div className='bulk-action-group'>
          <h5 className='bulk-action-header'>Categorize</h5>
          <div className='bulk-categorize-form'>
            <AccountDropdownSelect
              setCategory={setCategory}
              category={category}
              setInputCategory={setInputCategory}
              inputCategory={inputCategory}
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
          <h5 className='bulk-action-header'>Delete</h5>
          <div className='bulk-delete-form'>
            <p className='warn center'>
              <IoMdWarning style={{ fontSize: '2rem', margin: '-.5rem' }} />
            </p>
            <p className='warn center'>
              By hitting "Delete All" below, you are deleting all of the
              selected transactions. There is no undoing this action.
            </p>
            <div className='delete-modal-options'>
              <button
                onClick={() => {
                  deleteAllTransactions();
                }}
                className='delete-modal-yes'
              >
                Delete All
              </button>
              <button
                onClick={props.onRequestClose}
                className='delete-modal-no'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BulkActionModal;
