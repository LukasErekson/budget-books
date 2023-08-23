import React, { useEffect, useState } from 'react';
import { useAppDispatch, useThunkDispatch } from '../../../hooks/hooks';

import { useSelector } from 'react-redux';

import { AiFillPlusCircle } from 'react-icons/ai';

import Account from '../types/types';

import { changeCategorizationActiveAccount } from '../../../stores/PageSlice';
import { RootState } from '../../../stores/store';
import { fetchAccountTypes } from '../../AccountTypes/stores/accountTypeThunks';
import { fetchBankAccountTransactions } from '../../Transactions/stores/transactionThunks';
import { selectAccounts, selectBankAccounts } from '../stores/accountSelectors';
import { fetchAccounts } from '../stores/accountThunks';

import { AccountCard, NewAccountModal } from '../';

function AccountCardContainer(props: {
  activeAccountChangeCallback?: () => void;
}): JSX.Element {
  const bankAccounts: Account[] = useSelector((state: RootState) =>
    selectBankAccounts(state)
  );

  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  const [isAccountsLoaded, setIsAccountsLoaded]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const [isTypesFetched, setIsTypesFetched]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const [isAccountsFetched, setIsAccountsFetched]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(Boolean(accounts.length));

  const [modalIsOpen, setModalIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const thunkDispatch = useThunkDispatch();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAccountsLoaded) {
      if (!isAccountsFetched) {
        thunkDispatch(fetchAccounts('all'));
        setIsAccountsFetched(true);
      }
      if (!isTypesFetched) {
        thunkDispatch(fetchAccountTypes('all'));
        setIsTypesFetched(true);
      }
      if (bankAccounts.length) {
        thunkDispatch(
          fetchBankAccountTransactions(bankAccounts, 'uncategorized')
        );
      }
      // Only set loaded to true when all transactions have been fetched.
      if (isAccountsFetched && isTypesFetched && bankAccounts.length) {
        setIsAccountsLoaded(true);
      }
    }
  }, [
    thunkDispatch,
    bankAccounts,
    isAccountsLoaded,
    isAccountsFetched,
    isTypesFetched,
  ]);

  return (
    <>
      <NewAccountModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
      <h3 className={'accounts-header-title'}>Accounts</h3>
      <div className='accounts-container'>
        {isAccountsLoaded ? (
          bankAccounts.map((acct: Account) => (
            <AccountCard
              key={`account-${acct.id}`}
              accountData={acct}
              onClick={() => {
                dispatch(changeCategorizationActiveAccount(acct));
                if (props.activeAccountChangeCallback) {
                  props.activeAccountChangeCallback();
                }
              }}
            />
          ))
        ) : (
          <p>Loading Accounts...</p>
        )}
        <div className='new-account-btn-card'>
          <button
            className='new-account-btn'
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            <AiFillPlusCircle />
            Add New Account
          </button>
        </div>
      </div>
    </>
  );
}

export default AccountCardContainer;
