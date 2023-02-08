import React, { useEffect, useState } from 'react';

import Account from '../features/Accounts/types/types';

import { RootState } from '../stores/store';
import { useAppDispatch, useThunkDispatch } from '../hooks/hooks';
import { setTransactionsIsLoaded } from '../features/Transactions/stores/transactionSlice';
import { fetchAccountTransactions } from '../features/Transactions/stores/transactionThunks';
import { changeActiveAccount } from '../stores/PageSlice';

import { useSelector } from 'react-redux';

import { AccountCardContainer } from '../features/Accounts';

import { IoMdRefresh } from 'react-icons/io';
import { FiPlusCircle } from 'react-icons/fi';
import { BiUpload } from 'react-icons/bi';
import { RiCheckboxMultipleFill } from 'react-icons/ri';
import ButtonWithToolTip from '../components/ButtonWithToolTip';
import {
  UploadTxnModal,
  CategorizeList,
  BulkActionModal,
} from '../features/CategorizeTransactions';
import Transaction from '../features/Transactions/types/types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CategorizeTransactionsPage() {
  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.categorizationPage.activeAccount
  );
  const possibleAccounts: Account[] = useSelector(
    (state: RootState) => state.accounts.accounts
  );

  const [showaddNewTxn, setShowAddNewTxn]: [boolean, Function] =
    useState(false);

  const [showUploadTxnModal, setShowUploadTxnModal]: [boolean, Function] =
    useState(false);

  const [showBulkActionModal, setShowBulkActionModal]: [boolean, Function] =
    useState(false);

  const [selectedTransactions, setSelectedTransactions]: [
    Transaction[],
    Function
  ] = useState([]);

  function addSelectedTransaction(newTransaction: Transaction): void {
    if (
      !selectedTransactions
        .map((txn: Transaction) => txn.id)
        .includes(newTransaction.id)
    ) {
      setSelectedTransactions((prev: Transaction[]) => {
        prev.push(newTransaction);
        return prev;
      });
    }
  }

  function removeSelectedTransaction(removeTransaction: Transaction): void {
    setSelectedTransactions((prev: Transaction[]) =>
      prev.filter((txn: Transaction) => txn.id !== removeTransaction.id)
    );
  }

  const [accountTransactions, setAccountTransactions]: [JSX.Element, Function] =
    useState(
      <CategorizeList
        account={activeAccount}
        showAddNewTxn={showaddNewTxn}
        setShowAddNewTxn={setShowAddNewTxn}
        selectedTransactions={selectedTransactions}
        setSelectedTransactions={setSelectedTransactions}
        addSelectedTransaction={addSelectedTransaction}
        removeSelectedTransaction={removeSelectedTransaction}
      />
    );

  const dispatch = useAppDispatch();

  const thunkDispatch = useThunkDispatch();

  useEffect(() => {
    if (Object.keys(activeAccount).length === 0 || activeAccount.id === 0) {
      if (possibleAccounts.length > 0) {
        dispatch(changeActiveAccount(possibleAccounts[0]));
      }
    }
  }, [dispatch, activeAccount, possibleAccounts]);

  useEffect(() => {
    setAccountTransactions(
      <CategorizeList
        account={activeAccount}
        showAddNewTxn={showaddNewTxn}
        setShowAddNewTxn={setShowAddNewTxn}
        selectedTransactions={selectedTransactions}
        setSelectedTransactions={setSelectedTransactions}
        addSelectedTransaction={addSelectedTransaction}
        removeSelectedTransaction={removeSelectedTransaction}
      />
    );
  }, [activeAccount, showaddNewTxn]);

  function refreshTransactions(): void {
    let refreshIcon: Element =
      document.getElementsByClassName('refresh-icon')[0];

    refreshIcon.classList.toggle('rotate');

    dispatch(setTransactionsIsLoaded({ loaded: false }));
    thunkDispatch(fetchAccountTransactions(activeAccount, 'uncategorized'));

    setTimeout(() => {
      refreshIcon.classList.toggle('rotate');
    }, 750);
  }

  return (
    <>
      <AccountCardContainer />

      <div className='categorize-table-controls'>
        <div className='search-categorize-txns-container'>
          <label htmlFor='search-cat-txns'>Search Transactions: </label>
          <input type='text' className='search-categorize-txns' />
        </div>
        <ButtonWithToolTip
          onClick={() => {
            if (
              selectedTransactions.filter(
                (transaction) =>
                  transaction.debit_account_id === activeAccount.id ||
                  transaction.credit_account_id === activeAccount.id
              ).length !== 0
            ) {
              setShowBulkActionModal(true);
            } else {
              return toast.warning(
                'Bulk actions require at least 1 transaction to be selected.'
              );
            }
          }}
          toolTipContent='Bulk Actions'
          className='bulk-actions-btn'
        >
          <RiCheckboxMultipleFill />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={() => setShowAddNewTxn(true)}
          toolTipContent='Add Transaction'
          className='add-trxns-btn'
        >
          <FiPlusCircle />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={() => setShowUploadTxnModal(true)}
          toolTipContent='Upload Transactions'
          className='upload-trxns-btn'
        >
          <BiUpload />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={refreshTransactions}
          toolTipContent='Refresh'
          className='resfresh-trxns-btn'
        >
          <IoMdRefresh className='refresh-icon' />
        </ButtonWithToolTip>
      </div>
      {accountTransactions}

      <UploadTxnModal
        isOpen={showUploadTxnModal}
        onRequestClose={() => {
          setShowUploadTxnModal(false);
        }}
      />

      <BulkActionModal
        isOpen={showBulkActionModal}
        onRequestClose={() => {
          setShowBulkActionModal(false);
        }}
        selectedTransactions={selectedTransactions}
        removeSelectedTransactions={removeSelectedTransaction}
      />
    </>
  );
}

export default CategorizeTransactionsPage;
