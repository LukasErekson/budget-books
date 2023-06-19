import { createSlice } from '@reduxjs/toolkit';
import Account from '../features/Accounts/types/types';

const initialActiveAccount: Account | any = {};

/**
 * Redux slice for general page state management that doesn't fit
 * logically into the other slices. e.g - Active Account for the
 * Categorize Transactions page.
 */
export const pageSlice = createSlice({
  name: 'pageSlice',
  initialState: {
    categorizationPage: {
      activeAccount: initialActiveAccount,
    },
    accountSettingsPage: {
      activeAccount: initialActiveAccount,
      editAccountModalIsOpen: false,
    },
  },
  reducers: {
    changeCategorizationActiveAccount: (state, action) => {
      const newActiveAccount: Account = action.payload;
      return {
        ...state,
        categorizationPage: {
          ...state.categorizationPage,
          activeAccount: newActiveAccount,
        },
      };
    },
    openEditAccountModal: (state, action) => {
      const editAccount: Account = action.payload.editAccount;
      return {
        ...state,
        accountSettingsPage: {
          activeAccount: editAccount,
          editAccountModalIsOpen: true,
        },
      };
    },
    closeEditAccountModal: (state) => {
      return {
        ...state,
        accountSettingsPage: {
          ...state.accountSettingsPage,
          editAccountModalIsOpen: false,
        },
      };
    },
  },
});

export const {
  changeCategorizationActiveAccount,
  openEditAccountModal,
  closeEditAccountModal,
} = pageSlice.actions;

export default pageSlice.reducer;
