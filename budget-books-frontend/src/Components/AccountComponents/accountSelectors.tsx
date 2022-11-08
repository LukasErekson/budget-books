import { createSelector } from '@reduxjs/toolkit';

export const selectAccounts = (state: any) => state.accounts.accounts;
