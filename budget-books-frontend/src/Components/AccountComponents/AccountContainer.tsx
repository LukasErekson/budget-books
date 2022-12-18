import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NewAccountModal from './NewAccountModal';
import AccountCard from './AccountCard';
import { fetchAccounts } from './accountThunks';
import { selectAccounts, selectBankAccounts } from './accountSelectors';
import { AiFillPlusCircle } from 'react-icons/ai';
import { changeActiveAccount } from '../PageComponents/PageSlice';
import { fetchAccountTypes } from '../AccountTypeComponents/accountTypeThunks';
import Account from './accountTSTypes';
import AccountType from '../AccountTypeComponents/accountTypeTSTypes';
import { RootState } from '../../store';
import { useAppDispatch, useThunkDispatch } from '../../hooks';
import { fetchBankAccountTransactions } from '../TransactionComponents/transactionThunks';
import { selectAccountTypes } from '../AccountTypeComponents/accountTypeSelectors';

function AccountContainer(): JSX.Element {
  const [isAccountsLoaded, setIsAccountsLoaded]: [boolean, Function] =
    useState(false);

  const bankAccounts: Account[] = useSelector((state: RootState) =>
    selectBankAccounts(state)
  );

  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  const accountTypes: AccountType[] = useSelector((state: RootState) =>
    selectAccountTypes(state)
  );

  const [modalIsOpen, setModalIsOpen]: [boolean, Function] = useState(false);

  const thunkDispatch = useThunkDispatch();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAccountsLoaded) {
      if (!accounts.length) {
        thunkDispatch(fetchAccounts('all'));
      }
      if (!accountTypes.length) {
        thunkDispatch(fetchAccountTypes('all'));
      }
      if (bankAccounts.length) {
        // Only set loaded to true when all transactions have been fetched.
        thunkDispatch(fetchBankAccountTransactions(bankAccounts));
      }
      if (accounts.length && accountTypes.length && bankAccounts.length) {
        setIsAccountsLoaded(true);
      }
    }
  }, [thunkDispatch, accounts, accountTypes, bankAccounts, isAccountsLoaded]);

  return (
    <>
      <NewAccountModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
      <div className='accounts-container'>
        <p className={'accounts-header-title'}>Accounts</p>
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
