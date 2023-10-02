import { RootState } from '../../../stores/store';
import AccountType from '../types/types';

// Return the account type objects of the form {id: #, name: '', group: ''}
export const selectAccountTypes = (state: RootState): AccountType[] =>
  state.accountTypes.accountTypes;

// Return an array of the unique group names.
export const selectAccountTypeGroups = (state: RootState): string[] =>
  state.accountTypes.accountGroups;

// Return an array of the account labels.
export const selectAccountTypeNames = (state: RootState): string[] =>
  state.accountTypes.accountTypes.map(
    (accountTypeGroup: AccountType) => accountTypeGroup.name
  );
