import { createSlice } from '@reduxjs/toolkit';
import AccountType from '../types/types';

const initialAccountTypes: AccountType[] = [];
const initialAccountGroups: string[] = [];

export const accountTypeSlice = createSlice({
  name: 'accountTypes',
  initialState: {
    accountTypes: initialAccountTypes,
    accountGroups: initialAccountGroups,
  },
  reducers: {
    setAccountTypes: (state, action) => {
      const accountTypes: AccountType[] = action.payload.accountTypes;
      const accountGroups: string[] = action.payload.accountGroups;

      return {
        ...state,
        accountTypes: accountTypes,
        accountGroups: accountGroups,
      };
    },
    createNewAccountType: (state, action) => {
      const newAccountType: AccountType = action.payload;

      const newAccountTypeList: AccountType[] = [
        ...state.accountTypes,
        newAccountType,
      ];

      const newAccountGroupList: string[] = [...state.accountGroups];

      if (
        !newAccountGroupList.some(
          (groupName: string) => groupName === newAccountType.group_name
        )
      ) {
        newAccountGroupList.push(newAccountType.group_name);
      }

      return {
        ...state,
        accountTypes: newAccountTypeList,
        accountGroups: newAccountGroupList,
      };
    },
  },
});

export const { setAccountTypes, createNewAccountType } =
  accountTypeSlice.actions;

export default accountTypeSlice.reducer;
