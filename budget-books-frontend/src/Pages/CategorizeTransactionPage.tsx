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

  function handleMouseOver(event: any): void {
    let controlText: HTMLSpanElement;

    if (event.target.tagName !== 'BUTTON') {
      controlText = event.target.nextSibling;
    } else {
      controlText = event.target.children[1];
    }

    controlText?.classList.remove('hide');
    controlText?.classList.add('unhide');
    return;
  }

  function handleMouseOut(event: any): void {
    if (event.target.tagName !== 'BUTTON') {
      return;
    }
    let controlText: HTMLSpanElement = event.target.children[1];
    controlText?.classList.toggle('hide');
    controlText?.classList.toggle('unhide');
    return;
  }

  return (
    <>
      <AccountContainer />
      <div className='categorize-table-controls'>
        <div className='search-categorize-txns-container'>
          <label htmlFor='search-cat-txns'>Search Transactions: </label>
          <input type='text' className='search-categorize-txns' />
        </div>
        <button
          className='add-trxns-btn categorize-transaction-control'
          onClick={() => setShowAddNewTxn(true)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <FiPlusCircle />
          <span className='categorize-transaction-control-text hide'>
            Add Transaction
          </span>
        </button>
        <button
          className='upload-trxns-btn categorize-transaction-control'
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <BiUpload />
          <span className='categorize-transaction-control-text hide'>
            Upload Transactions
          </span>
        </button>
        <button
          className='resfresh-trxns-btn categorize-transaction-control'
          onClick={refreshTransactions}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <IoMdRefresh className='refresh-icon' />
          <span className='categorize-transaction-control-text refresh-text hide'>
            Refresh
          </span>
        </button>
      </div>
      {accountTransactions}
    </>
  );
}

export default CategorizeTransactionsPage;
