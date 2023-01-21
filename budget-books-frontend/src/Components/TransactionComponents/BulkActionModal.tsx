import React, { FC, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdWarning } from 'react-icons/io';

import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { useThunkDispatch } from '../../hooks';
import { RootState } from '../../store';
import AccountSelect from '../AccountComponents/AccountSelect';
import { addNewAccount } from '../AccountComponents/accountThunks';
import Account from '../AccountComponents/accountTSTypes';
import { addManyTransactionCategories } from './transactionThunks';
import Transaction from './transactionTSTypes';

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
      portalClassName='delete-txn-modal'
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
        <h5 className='bulk-action-header'>Categorize</h5>
        <div className='bulk-categorize-form'>
          <AccountSelect
            setCategory={setCategory}
            category={category}
            setInputCategory={setInputCategory}
            inputCategory={inputCategory}
            excludeAccount={activeAccount}
          />
          <button className='add-txn-btn' onClick={postCategorizeTransactions}>
            Categorize
          </button>
        </div>
        <h5 className='bulk-action-header'>Delete</h5>
        <button>Delete</button>
      </div>
    </Modal>
  );
};

export default BulkActionModal;
