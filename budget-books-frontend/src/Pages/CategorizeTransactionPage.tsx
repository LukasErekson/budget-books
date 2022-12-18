import React, { useEffect, useState } from 'react';
import AccountContainer from '../Components/AccountComponents/AccountContainer';
import CategorizeList from '../Components/TransactionComponents/CategorizeList';
import { useSelector } from 'react-redux';
import { changeActiveAccount } from '../Components/PageComponents/PageSlice';
import { useAppDispatch, useThunkDispatch } from '../hooks';
import { RootState } from '../store';
import Account from '../Components/AccountComponents/accountTSTypes';

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

  return (
    <>
      <AccountContainer />
      {accountTransactions}
    </>
  );
}

export default CategorizeTransactionsPage;
