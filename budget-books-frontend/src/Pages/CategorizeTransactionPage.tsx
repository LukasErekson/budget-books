import React, { useEffect, useState } from 'react';
import AccountContainer from '../Components/AccountComponents/AccountContainer';
import CategorizeList from '../Components/TransactionComponents/CategorizeList';
import { connect, useDispatch, useSelector } from 'react-redux';
import { changeActiveAccount } from '../Components/PageComponents/PageSlice';

function CategorizeTransactionsPage(props: any) {
  const activeAccountID: Number = useSelector(
    (state: any) => state.pageSlice.activeAccountID
  );
  const possibleAccounts: Number[] = useSelector((state: any) =>
    state.accounts.accounts.map((account: any) => account.id)
  );
  const [accountTransactions, setAccountTransactions]: [JSX.Element, Function] =
    useState(<CategorizeList accountIDs={[activeAccountID]} />);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeAccountID || activeAccountID === 0) {
      if (possibleAccounts.length > 0)
        dispatch(changeActiveAccount(possibleAccounts[0]));
    }
  }, [dispatch, activeAccountID, possibleAccounts]);

  useEffect(() => {
    setAccountTransactions(<CategorizeList accountIDs={[activeAccountID]} />);
  }, [activeAccountID]);

  console.log(`Active Account ID: ${activeAccountID}`);

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
    changeActiveAccount: (newAccountID: Number) =>
      dispatch(changeActiveAccount(newAccountID)),
  };
};

export default connect(
  mapStateToProps,
  mapDipsatchToProps
)(CategorizeTransactionsPage);
