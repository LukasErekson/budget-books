import React, { useEffect, useState } from 'react';
import AccountContainer from '../Components/AccountComponents/AccountContainer';
import CategorizeList from '../Components/TransactionComponents/CategorizeList';
import { setTransactionsIsLoaded } from '../Components/TransactionComponents/transactionSlice';
import { fetchAccountTransactions } from '../Components/TransactionComponents/transactionThunks';
import { useSelector } from 'react-redux';
import { changeActiveAccount } from '../Components/PageComponents/PageSlice';
import { useAppDispatch, useThunkDispatch } from '../hooks';
import { IoMdRefresh } from 'react-icons/io';
import { RootState } from '../store';
import Account from '../Components/AccountComponents/accountTSTypes';
import { FiPlusCircle } from 'react-icons/fi';

function CategorizeTransactionsPage() {
  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.activeAccount
  );
  const possibleAccounts: Account[] = useSelector(
    (state: RootState) => state.accounts.accounts
  );
  const [accountTransactions, setAccountTransactions]: [JSX.Element, Function] =
    useState(<CategorizeList account={activeAccount} />);

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
    setAccountTransactions(<CategorizeList account={activeAccount} />);
  }, [activeAccount]);

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
        <button className='add-trxns-btn categorize-transaction-control'>
          <FiPlusCircle />
        </button>
        <button
          className='resfresh-trxns-btn categorize-transaction-control'
          onClick={refreshTransactions}
        >
          <IoMdRefresh className='refresh-icon' />
        </button>
      </div>
      {accountTransactions}
    </>
  );
}

export default CategorizeTransactionsPage;
