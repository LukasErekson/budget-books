import React, { useEffect, useState } from 'react';
import AccountContainer from '../Components/AccountComponents/AccountContainer';
import Transactions from '../Components/Transactions';
import { connect, useDispatch, useSelector } from 'react-redux';
import { changeActiveAccount } from '../Components/PageComponents/PageSlice';

function CategorizeTransactionsPage(props: { changeActiveAccount: Function }) {
  const activeAccountID: Number = useSelector(
    (state: any) => state.pageSlice.activeAccountID
  );
  const possibleAccounts: Number[] = useSelector((state: any) =>
    state.accounts.accounts.map((account: any) => account.id)
  );
  const [accountTransactions, setAccountTransactions]: [any[], Function] =
    useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeAccountID || activeAccountID === 0) {
      if (possibleAccounts.length > 0)
        props.changeActiveAccount(possibleAccounts[0]);
    }
  }, [props, activeAccountID, possibleAccounts]);

  console.log(activeAccountID);

  return (
    <>
      <AccountContainer />
      {activeAccountID !== 0 && <Transactions accountIDs={[activeAccountID]} />}
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
