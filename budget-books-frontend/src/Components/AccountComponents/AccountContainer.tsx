import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import NewAccountModal from './NewAccountModal';
import AccountCard from './AccountCard';
import { fetchAccounts } from './accountThunks';
import { selectBankAccounts } from './accountSelectors';
import { AiFillPlusCircle } from 'react-icons/ai';
import { changeActiveAccount } from '../PageComponents/PageSlice';
import { fetchAccountTypes } from '../AccountTypeComponents/accountTypeThunks';

function AccountContainer(props: {
  changeActiveAccount: Function;
  fetchAccounts: Function;
  fetchAccountTypes: Function;
}): JSX.Element {
  const [isAccountsLoaded, setIsAccountsLoaded]: [boolean, Function] =
    useState(false);

  const accountData: any[] = useSelector((state: any) =>
    selectBankAccounts(state)
  );

  const [modalIsOpen, setModalIsOpen]: [boolean, Function] = useState(false);

  useEffect(() => {
    if (!isAccountsLoaded) {
      props.fetchAccounts('all');
      props.fetchAccountTypes('all');
      setIsAccountsLoaded(true);
    }
  }, [props, isAccountsLoaded]);

  return (
    <>
      <NewAccountModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
      <div className='accounts-container'>
        <p className={'accounts-header-title'}>Accounts</p>
        {isAccountsLoaded ? (
          accountData.map((val, idx) => (
            <AccountCard
              key={`account-${val.id}`}
              accountData={val}
              onClick={() => props.changeActiveAccount(val.id)}
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

const mapStateToProps = (state: any) => {
  return {};
};

const mapDipsatchToProps = (dispatch: Function) => {
  return {
    changeActiveAccount: (accountID: Number) =>
      dispatch(changeActiveAccount(accountID)),
    fetchAccounts: (accountType: string) =>
      dispatch(fetchAccounts(accountType)),
    fetchAccountTypes: (group: string) => dispatch(fetchAccountTypes(group)),
  };
};

export default connect(mapStateToProps, mapDipsatchToProps)(AccountContainer);
