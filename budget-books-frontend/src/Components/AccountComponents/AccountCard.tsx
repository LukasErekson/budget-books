import React from 'react';
import { pyToJsDate } from '../../Common/TextFilters';

function AccountCard(props: { accountData: any }): JSX.Element {
    const { name, balance, account_type, end_date } = props.accountData;
    const isNegative = balance < 0.0;

    return (
        <>
            <div className='account-card'>
                <h3 className={'account-name'}>{name}</h3>
                <h2
                    className={
                        (isNegative ? 'negative' : 'positive') +
                        ' account-balance-num'
                    }
                >{`${isNegative ? '-' : ''}$${Math.abs(balance)}`}</h2>
                <p className={'account-type'}>{account_type}</p>
                <p className={'account-end-date'}>
                    As of {pyToJsDate(end_date)}
                </p>
            </div>
        </>
    );
}

export default AccountCard;
