import React from 'react';

import { useSelector } from 'react-redux';

import Account from '../types/types';

import { RootState } from '../../../stores/store';
import { selectUncategorizedTransactions } from '../../Transactions/stores/transactionSelectors';

import { pyToJsDate } from '../../../utils/TextFilters';

function AccountCard(props: {
  accountData: Account;
  onClick: () => void;
}): JSX.Element {
  const { id, name, balance, account_type, last_updated } = props.accountData;

  const isNegative: boolean =
    (balance < 0.0 && props.accountData.debit_inc === 1) ||
    (balance > 0.0 && props.accountData.debit_inc === 0);

  const activeAccountID: number = useSelector(
    (state: RootState) => state.pageSlice.categorizationPage.activeAccount.id
  );

  const uncategorizedTransactionsList: any[] = useSelector((state: any) =>
    selectUncategorizedTransactions(state, id)
  );

  return (
    <>
      <div
        className={
          'account-card ' +
          (id === activeAccountID ? 'active-account-card' : '')
        }
        onClick={() => props.onClick()}
      >
        <div className='account-card-header'>
          <h3 className={'account-name'}>{name}</h3>
          <p className={'account-type'}>{account_type}</p>
          <p className={'account-updated-date'}>
            As of {pyToJsDate(last_updated)}
          </p>
        </div>
        <h2
          className={
            (isNegative ? 'negative' : 'positive') + ' account-balance-num'
          }
        >{`${isNegative ? '-' : ''}$${Math.abs(balance).toFixed(2)}`}</h2>
        {/* TODO: Add the actual number of uncategorized transactions - Muted if it's 0, a different class otherwise.*/}
        <p
          className={
            'account-uncategorized-transactions ' +
            (uncategorizedTransactionsList.length === 0
              ? 'muted'
              : 'uncategorized-alert')
          }
        >
          {uncategorizedTransactionsList.length}
        </p>
      </div>
    </>
  );
}

export default AccountCard;
