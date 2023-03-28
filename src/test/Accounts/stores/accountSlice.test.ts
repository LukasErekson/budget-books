import Account from '../../../features/Accounts/types/types';

import {
  loadAccounts,
  updateAccountBalances,
  accountSlice,
} from '../../../features/Accounts/stores/accountSlice';

describe('accountSlice Reducers', () => {
  describe('loadAccounts', () => {
    it('Updates the state with passed in accounts', () => {
      const newAccounts: Account[] = [
        {
          id: 1,
          name: 'Account 1',
          account_type_id: 1,
          account_type: 'Test',
          debit_inc: true,
          balance: 0.0,
          last_updated: '01/01/2023',
        },
      ];

      const { payload, type } = loadAccounts(newAccounts);

      expect(payload).toEqual(newAccounts);
      expect(type).toEqual('accounts/loadAccounts');

      const newState = accountSlice.reducer(
        { accounts: [] as Account[] },
        { payload, type }
      );

      expect(newState).toEqual({
        state: { accounts: [] as Account[] },
        accounts: newAccounts,
      });
    });
  });

  describe('updateAccountBalances', () => {
    it('Updates the state with passed in account balances', () => {
      const stateAccounts: Account[] = [
        {
          id: 1,
          name: 'Account 1',
          account_type_id: 1,
          account_type: 'Test',
          debit_inc: true,
          balance: 0.0,
          last_updated: '01/01/2023',
        },
        {
          id: 2,
          name: 'Account 22',
          account_type_id: 1,
          account_type: 'Test',
          debit_inc: true,
          balance: 0.0,
          last_updated: '01/01/2023',
        },
      ];

      const newBalance = 37.65;

      const balancesToUpdate: { [id: number]: number } = { 2: newBalance };

      const { payload, type } = updateAccountBalances(balancesToUpdate);

      expect(payload).toEqual(balancesToUpdate);
      expect(type).toEqual('accounts/updateAccountBalances');

      const newState = accountSlice.reducer(
        { accounts: stateAccounts },
        { payload, type }
      );

      expect(newState).toEqual({
        state: { accounts: stateAccounts },
        accounts: [
          stateAccounts[0],
          { ...stateAccounts[1], balance: newBalance },
        ],
      });
    });
  });
});
