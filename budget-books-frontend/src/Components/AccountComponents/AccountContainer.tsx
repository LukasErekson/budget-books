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

function AccountContainer(): JSX.Element {
  const [isAccountsLoaded, setIsAccountsLoaded]: [boolean, Function] =
    useState(false);

  const accountData: Account[] = useSelector((state: RootState) =>
    selectBankAccounts(state)
  );

  const [modalIsOpen, setModalIsOpen]: [boolean, Function] = useState(false);

  const thunkDispatch = useThunkDispatch();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAccountsLoaded) {
      thunkDispatch(fetchAccounts('all'));
      thunkDispatch(fetchAccountTypes('all'));
      setIsAccountsLoaded(true);
    }
  }, [thunkDispatch, isAccountsLoaded]);

  return (
    <>
      <NewAccountModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
      <div className='accounts-container'>
        <p className={'accounts-header-title'}>Accounts</p>
        {isAccountsLoaded ? (
          accountData.map((acct: Account) => (
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
