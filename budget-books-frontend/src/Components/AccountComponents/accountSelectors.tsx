import { createSelector } from '@reduxjs/toolkit';

const bankAccountTypes = ['Credit Card', 'Checking Account', 'Savings Account'];

export const selectAccounts = (state: any) => state.accounts.accounts;

export const selectBankAccounts = (state: any) =>
  state.accounts.accounts.filter((account: any) =>
    bankAccountTypes.includes(account.account_type)
  );
