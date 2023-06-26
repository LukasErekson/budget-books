import React, { useEffect, useState } from 'react';
import Account from '../types/types';
import { useSelector } from 'react-redux';
import { selectAccounts } from '../stores/accountSelectors';
import { RootState } from '../../../stores/store';
import AccountForm from './AccountForm';
import { useThunkDispatch } from '../../../hooks/hooks';
import { fetchAccounts } from '../stores/accountThunks';
import { TbSortAscending, TbSortDescending } from 'react-icons/tb';

function AccountList(): JSX.Element {
  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  const sortFuncMap: {
    [sortBy: string]: (a: Account, b: Account) => -1 | 0 | 1;
  } = {
    account_type_asc: function (a: Account, b: Account): -1 | 0 | 1 {
      if (a.account_type < b.account_type) {
        return 1;
      } else if (a.account_type > b.account_type) {
        return -1;
      }
      return 0;
    },
    account_type_desc: function (a: Account, b: Account): -1 | 0 | 1 {
      if (a.account_type < b.account_type) {
        return -1;
      } else if (a.account_type > b.account_type) {
        return 1;
      }
      return 0;
    },
    name_asc: function (a: Account, b: Account): -1 | 0 | 1 {
      if (a.name < b.name) {
        return 1;
      } else if (a.name > b.name) {
        return -1;
      }
      return 0;
    },
    name_desc: function (a: Account, b: Account): -1 | 0 | 1 {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    },
    last_updated_asc: function (a: Account, b: Account): -1 | 0 | 1 {
      const aDate = new Date(a.last_updated);
      const bDate = new Date(b.last_updated);
      if (aDate < bDate) {
        return 1;
      } else if (aDate > bDate) {
        return -1;
      }
      return 0;
    },
    last_updated_desc: function (a: Account, b: Account): -1 | 0 | 1 {
      const aDate = new Date(a.last_updated);
      const bDate = new Date(b.last_updated);
      if (aDate < bDate) {
        return -1;
      } else if (aDate > bDate) {
        return 1;
      }
      return 0;
    },
  };

  const [sortAccountsBy, setSortAccountsBy]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState('account_type_asc');

  const thunkDispatch = useThunkDispatch();

  useEffect(() => {
    if (!accounts.length) {
      thunkDispatch(fetchAccounts('all'));
    }
  }, []);

  const sortedAccounts: Account[] = [...accounts];

  sortedAccounts.sort(sortFuncMap[sortAccountsBy]);

  return (
    <table id='accounts-table'>
      <thead>
        <tr>
          <th
            className={'account-table-header'}
            onClick={() => {
              if (sortAccountsBy === 'name_asc') {
                setSortAccountsBy('name_desc');
                return;
              }
              setSortAccountsBy('name_asc');
            }}
            style={{ cursor: 'pointer' }}
          >
            {(sortAccountsBy.includes('name_asc') && <TbSortAscending />) ||
              (sortAccountsBy.includes('name_desc') && <TbSortDescending />)}
            Account Name
          </th>
          <th
            className={'account-table-header'}
            onClick={() => {
              if (sortAccountsBy === 'account_type_asc') {
                setSortAccountsBy('account_type_desc');
                return;
              }
              setSortAccountsBy('account_type_asc');
            }}
            style={{ cursor: 'pointer' }}
          >
            {(sortAccountsBy.includes('account_type_asc') && (
              <TbSortAscending />
            )) ||
              (sortAccountsBy.includes('account_type_desc') && (
                <TbSortDescending />
              ))}
            Account Type
          </th>
          <th className={'account-table-header'}>Current Balance</th>
          <th className={'account-table-header'}>Normal Side</th>
          <th
            className={'account-table-header'}
            onClick={() => {
              if (sortAccountsBy === 'last_updated_asc') {
                setSortAccountsBy('last_updated_desc');
                return;
              }
              setSortAccountsBy('last_updated_asc');
            }}
            style={{ cursor: 'pointer' }}
          >
            {(sortAccountsBy.includes('last_updated_asc') && (
              <TbSortAscending />
            )) ||
              (sortAccountsBy.includes('last_updated_desc') && (
                <TbSortDescending />
              ))}
            Last Updated
          </th>
          <th className={'account-table-header'}></th>
        </tr>
      </thead>
      <tbody>
        {sortedAccounts.map((account: Account) => (
          <tr key={`account-${account.id}`}>
            <AccountForm account={account} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AccountList;
