import React, { useEffect, useState } from 'react';

import Account from '../Components/AccountComponents/accountTSTypes';

import { RootState } from '../store';
import { useAppDispatch, useThunkDispatch } from '../hooks';
import { setTransactionsIsLoaded } from '../Components/TransactionComponents/transactionSlice';
import { fetchAccountTransactions } from '../Components/TransactionComponents/transactionThunks';
import { changeActiveAccount } from '../Components/PageComponents/PageSlice';

import { useSelector } from 'react-redux';

import AccountContainer from '../Components/AccountComponents/AccountContainer';
import CategorizeList from '../Components/TransactionComponents/CategorizeList';

import { IoMdRefresh } from 'react-icons/io';
import { FiPlusCircle } from 'react-icons/fi';
import { BiUpload } from 'react-icons/bi';
import ButtonWithToolTip from '../Components/SharedComponents/ButtonWithToolTip';

function CategorizeTransactionsPage() {
  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.activeAccount
  );
  const possibleAccounts: Account[] = useSelector(
    (state: RootState) => state.accounts.accounts
  );

  const [showaddNewTxn, setShowAddNewTxn]: [Boolean, Function] =
    useState(false);

  const [accountTransactions, setAccountTransactions]: [JSX.Element, Function] =
    useState(
      <CategorizeList
        account={activeAccount}
        showAddNewTxn={showaddNewTxn}
        setShowAddNewTxn={setShowAddNewTxn}
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
      />
    );
  }, [activeAccount, showaddNewTxn]);

  function refreshTransactions(): void {
    let refreshIcon: Element =
      document.getElementsByClassName('refresh-icon')[0];

    refreshIcon.classList.toggle('rotate');

    dispatch(setTransactionsIsLoaded({ loaded: false }));
    thunkDispatch(fetchAccountTransactions(activeAccount));

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
          onClick={() => setShowAddNewTxn(true)}
          buttonContent={<FiPlusCircle />}
          toolTipContent='Add Transaction'
          className='add-trxns-btn'
        />

        <ButtonWithToolTip
          onClick={() => {}}
          buttonContent={<BiUpload />}
          toolTipContent='Upload Transactions'
          className='upload-trxns-btn'
        />

        <ButtonWithToolTip
          onClick={refreshTransactions}
          buttonContent={<IoMdRefresh className='refresh-icon' />}
          toolTipContent='Refresh'
          className='resfresh-trxns-btn'
        />
      </div>
      {accountTransactions}
    </>
  );
}

export default CategorizeTransactionsPage;
