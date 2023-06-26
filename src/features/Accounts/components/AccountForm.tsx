import React from 'react';
import Account from '../types/types';
import { pyToJsDate } from '../../../utils/TextFilters';
import { useDispatch } from 'react-redux';
import { openEditAccountModal } from '../../../stores/PageSlice';

function AccountForm(props: { account: Account }): JSX.Element {
  const account: Account = props.account;
  const negativeBalance: boolean = account.balance < 0.0;

  const dispatch = useDispatch();

  return (
    <>
      <td>{account.name}</td>
      <td>{account.account_type}</td>
      <td className={negativeBalance ? 'negative' : 'positive'}>
        {negativeBalance && '-'}${Math.abs(account.balance).toFixed(2)}{' '}
      </td>
      <td>{account.debit_inc ? 'Debit' : 'Credit'}</td>
      <td>{pyToJsDate(account.last_updated)}</td>
      <td>
        <button
          className='categorize-txn-btn'
          onClick={() =>
            dispatch(openEditAccountModal({ editAccount: account }))
          }
        >
          Edit
        </button>
      </td>
    </>
  );
}

export default AccountForm;
