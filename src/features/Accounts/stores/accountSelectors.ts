import { RootState } from '../../../stores/store';
import Account from '../types/types';

const bankAccountTypes = ['Credit Card', 'Checking Account', 'Savings Account'];

export const selectAccounts = (state: RootState): Account[] =>
  state.accounts.accounts;

export const selectAccountNames = (state: RootState): string[] =>
  state.accounts.accounts.map((account: Account) => account.name);

export const selectBankAccounts = (state: RootState): Account[] =>
  state.accounts.accounts.filter((account: Account) =>
    bankAccountTypes.includes(account.account_type)
  );

export const selectAccountTypesUsed = (state: RootState): string[] =>
  state.accounts.accounts.map((account: Account) => account.account_type);
