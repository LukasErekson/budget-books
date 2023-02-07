import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NewAccountModal from './NewAccountModal';
import AccountCard from './AccountCard';
import { fetchAccounts } from './accountThunks';
import { selectBankAccounts } from './accountSelectors';
import { AiFillPlusCircle } from 'react-icons/ai';
import { changeActiveAccount } from '../PageComponents/PageSlice';
import { fetchAccountTypes } from '../AccountTypeComponents/accountTypeThunks';
import Account from './accountTSTypes';
import { RootState } from '../../store';
import { useAppDispatch, useThunkDispatch } from '../../hooks';
import { fetchBankAccountTransactions } from '../TransactionComponents/transactionThunks';

function AccountContainer(): JSX.Element {
  const [isAccountsLoaded, setIsAccountsLoaded]: [boolean, Function] =
    useState(false);

  const [isTypesFetched, setIsTypesFetched]: [boolean, Function] =
    useState(false);

  const [isAccountsFetched, setIsAccountsFetched]: [boolean, Function] =
    useState(false);

  const bankAccounts: Account[] = useSelector((state: RootState) =>
    selectBankAccounts(state)
  );

  const [modalIsOpen, setModalIsOpen]: [boolean, Function] = useState(false);

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
              onClick={() => dispatch(changeActiveAccount(acct))}
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

export default AccountContainer;
