import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import AccountCard from './AccountCard';
import { addNewAccount, fetchAllAccounts } from './accountThunks';
import { selectAccounts } from './accountSelectors';
import { AiFillPlusCircle } from 'react-icons/ai';

function AccountContainer(props: {
    selectAccounts: any[];
    fetchAllAccounts: Function;
    addNewAccount: Function;
}): JSX.Element {
    const [isAccountsLoaded, setIsAccountsLoaded]: [boolean, Function] =
        useState(false);
    const accountData: any[] = useSelector(
        (state: any) => state.accounts.accounts
    );

    useEffect(() => {
        if (!isAccountsLoaded) {
            props.fetchAllAccounts();
            setIsAccountsLoaded(true);
        }
    }, [isAccountsLoaded, props]);

    return (
        <>
            <div className='accounts-container'>
                <p className={'accounts-header-title'}>Accounts</p>
                {isAccountsLoaded ? (
                    accountData.map((val, idx) => (
                        <AccountCard
                            key={`account-${val.id}`}
                            accountData={val}
                        />
                    ))
                ) : (
                    <p>Loading Accounts...</p>
                )}
                <div className='new-account-btn-card'>
                    <button
                        className='new-account-btn'
                        onClick={() => {
                            props.addNewAccount('Example Account', 1, true);
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
    return {
        selectAccounts: selectAccounts(state),
    };
};

const mapDipsatchToProps = (dispatch: Function) => {
    return {
        fetchAllAccounts: () => dispatch(fetchAllAccounts()),
        addNewAccount: (
            name: string,
            account_type: string,
            debit_inc: boolean
        ) => dispatch(addNewAccount(name, account_type, debit_inc)),
    };
};

export default connect(mapStateToProps, mapDipsatchToProps)(AccountContainer);
