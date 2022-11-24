import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import NewAccountModal from './NewAccountModal';
import AccountCard from './AccountCard';
import { fetchAllAccounts } from './accountThunks';
import { selectAccounts } from './accountSelectors';
import { AiFillPlusCircle } from 'react-icons/ai';

function AccountContainer(props: {
    selectAccounts: any[];
    fetchAllAccounts: Function;
}): JSX.Element {
    const [isAccountsLoaded, setIsAccountsLoaded]: [boolean, Function] =
        useState(false);
    const accountData: any[] = useSelector(
        (state: any) => state.accounts.accounts
    );

    const [modalIsOpen, setModalIsOpen]: [boolean, Function] = useState(false);

    useEffect(() => {
        if (!isAccountsLoaded) {
            props.fetchAllAccounts();
            setIsAccountsLoaded(true);
        }
    }, [isAccountsLoaded, props]);

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
    return {
        selectAccounts: selectAccounts(state),
    };
};

const mapDipsatchToProps = (dispatch: Function) => {
    return {
        fetchAllAccounts: () => dispatch(fetchAllAccounts()),
    };
};

export default connect(mapStateToProps, mapDipsatchToProps)(AccountContainer);
