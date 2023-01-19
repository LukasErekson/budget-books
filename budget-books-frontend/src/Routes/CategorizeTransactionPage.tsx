import React, { useEffect, useState } from 'react';

import Account from '../Components/AccountComponents/accountTSTypes';

import { RootState } from '../store';
import { useAppDispatch, useThunkDispatch } from '../hooks';
import { setTransactionsIsLoaded } from '../Components/TransactionComponents/transactionSlice';
import { fetchAccountTransactions } from '../Components/TransactionComponents/transactionThunks';
import { changeActiveAccount } from '../Components/PageComponents/PageSlice';

import { useSelector } from 'react-redux';

import AccountContainer from '../Components/AccountComponents/AccountContainer';
import CategorizeList from '../Components/TransactionComponents/CategorizeTransactions/CategorizeList';

import { IoMdRefresh } from 'react-icons/io';
import { FiPlusCircle } from 'react-icons/fi';
import { BiUpload } from 'react-icons/bi';
import { RiCheckboxMultipleFill } from 'react-icons/ri';
import ButtonWithToolTip from '../Components/SharedComponents/ButtonWithToolTip';
import UploadTxnModal from '../Components/TransactionComponents/UploadTxnModal';
import BulkActionModal from '../Components/TransactionComponents/BulkActionModal';
import Transaction from '../Components/TransactionComponents/transactionTSTypes';

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
      <AccountContainer />

      <div className='categorize-table-controls'>
        <div className='search-categorize-txns-container'>
          <label htmlFor='search-cat-txns'>Search Transactions: </label>
          <input type='text' className='search-categorize-txns' />
        </div>

        <ButtonWithToolTip
          onClick={() => setShowBulkActionModal(true)}
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
      />
    </>
  );
}

export default CategorizeTransactionsPage;
