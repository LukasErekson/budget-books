import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import AccountCard from './AccountCard';
import { fetchAllAccounts } from './accountThunks';
import { selectAccounts } from './accountSelectors';

function AccountHeader(props: {
    selectAccounts: any[];
    fetchAllAccounts: Function;
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
    }, []);

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
    };
};

export default connect(mapStateToProps, mapDipsatchToProps)(AccountHeader);
