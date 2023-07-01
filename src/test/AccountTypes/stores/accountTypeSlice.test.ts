import {
  accountTypeSlice,
  setAccountTypes,
} from '../../../features/AccountTypes/stores/accountTypeSlice';
import AccountType from '../../../features/AccountTypes/types/types';

describe('accountTypeSlice Reduces', () => {
  describe('setAccountTypes', () => {
    it('Sets the accountTypes and accountGroups', async () => {
      const newAccountTypes: AccountType[] = [
        {
          id: 1,
          name: 'Checking Account',
          group_name: 'Assets',
        },
        {
          id: 2,
          name: 'Credit Card',
          group_name: 'Liabilities',
        },
      ];

      const newAccountGroups: string[] = ['Assets', 'Liabilities'];

      const { payload, type } = setAccountTypes({
        accountTypes: newAccountTypes,
        accountGroups: newAccountGroups,
      });

      expect(payload).toEqual({
        accountTypes: newAccountTypes,
        accountGroups: newAccountGroups,
      });
      expect(type).toEqual('accountTypes/setAccountTypes');

      const newState = accountTypeSlice.reducer(
        { accountGroups: [], accountTypes: [] },
        { payload, type }
      );

      expect(newState).toEqual({
        accountTypes: newAccountTypes,
        accountGroups: newAccountGroups,
      });
    });
  });
});
