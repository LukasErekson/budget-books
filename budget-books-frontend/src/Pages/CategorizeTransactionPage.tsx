import React, { useEffect, useState } from 'react';
import AccountContainer from '../Components/AccountComponents/AccountContainer';
import CategorizeList from '../Components/TransactionComponents/CategorizeList';
import { connect, useDispatch, useSelector } from 'react-redux';
import { changeActiveAccount } from '../Components/PageComponents/PageSlice';

function CategorizeTransactionsPage(props: any) {
  const activeAccount: any = useSelector(
    (state: any) => state.pageSlice.activeAccount
  );
  const possibleAccounts: Number[] = useSelector(
    (state: any) => state.accounts.accounts
  );
  const [accountTransactions, setAccountTransactions]: [JSX.Element, Function] =
    useState(<CategorizeList account={activeAccount} />);

  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(activeAccount).length === 0 || activeAccount.id === 0) {
      if (possibleAccounts.length > 0)
        dispatch(changeActiveAccount(possibleAccounts[0]));
    }
  }, [dispatch, activeAccount, possibleAccounts]);

  useEffect(() => {
    setAccountTransactions(<CategorizeList account={activeAccount} />);
  }, [activeAccount]);

  console.log(`Active Account: ${activeAccount}`);

  return (
    <>
      <AccountContainer />
      {accountTransactions}
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {};
};

const mapDipsatchToProps = (dispatch: Function) => {
  return {
    changeActiveAccount: (newAccount: any) =>
      dispatch(changeActiveAccount(newAccount)),
  };
};

export default connect(
  mapStateToProps,
  mapDipsatchToProps
)(CategorizeTransactionsPage);
