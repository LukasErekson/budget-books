import React from 'react';
import { pyToJsDate } from '../../Common/TextFilters';

function AccountCard(props: { accountData: any }): JSX.Element {
    const {
        name,
        balance,
        account_type,
        last_updated,
        uncategorized_transactions, // TODO: Make this part of the store so that it communicates in real time with categorization.
    } = props.accountData;
    const isNegative = balance < 0.0;

    return (
        <>
            <div className='account-card'>
                <div className='account-card-header'>
                    <h3 className={'account-name'}>{name}</h3>
                    <p className={'account-type'}>{account_type}</p>
                    <p className={'account-updated-date'}>
                        As of {pyToJsDate(last_updated)}
                    </p>
                </div>
                <h2
                    className={
                        (isNegative ? 'negative' : 'positive') +
                        ' account-balance-num'
                    }
                >{`${isNegative ? '-' : ''}$${Math.abs(balance).toFixed(
                    2
                )}`}</h2>
                {/* TODO: Add the actual number of uncategorized transactions - Muted if it's 0, a different class otherwise.*/}
                <p
                    className={
                        'account-uncategorized-transactions ' +
                        (+uncategorized_transactions === 0
                            ? 'muted'
                            : 'uncategorized-alert')
                    }
                >
                    {uncategorized_transactions}
                </p>
            </div>
        </>
    );
}

export default AccountCard;
