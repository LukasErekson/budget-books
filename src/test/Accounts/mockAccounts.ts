import Account from '../../features/Accounts/types/types';

export const fakeAccounts: Account[] = [
  {
    id: 1,
    name: 'Fake Account 1',
    account_type_id: 1,
    account_type: 'Checking Account',
    debit_inc: true,
    balance: 10.27,
    last_updated: '2022-02-22',
    account_group: 'Group 1',
  },
  {
    id: 2,
    name: 'Fake Account 2',
    account_type_id: 2,
    account_type: 'Credit Card',
    debit_inc: false,
    balance: -10.27,
    last_updated: '2022-02-22',
    account_group: 'Group 2',
  },
  {
    id: 3,
    name: 'Fake Account 3',
    account_type_id: 2,
    account_type: 'Credit Card',
    debit_inc: false,
    balance: 0.0,
    last_updated: '2022-02-22',
    account_group: 'Group 2',
  },
];

export const otherAccount: Account = {
  id: 2,
  name: 'Fake Other Account',
  account_type_id: 1,
  account_type: 'Test',
  debit_inc: true,
  balance: 10.0,
  last_updated: '03/03/2023',
  account_group: 'Group 2',
};
