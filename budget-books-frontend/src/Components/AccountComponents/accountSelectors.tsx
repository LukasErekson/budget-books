import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  selectAccountTypeGroups,
  selectAccountTypes,
} from '../AccountTypeComponents/accountTypeSelectors';

const selectSelf = (state: RootState) => state;

const bankAccountTypes = ['Credit Card', 'Checking Account', 'Savings Account'];

export const selectAccounts = (state: any) => state.accounts.accounts;

export const selectBankAccounts = (state: any) =>
  state.accounts.accounts.filter((account: any) =>
    bankAccountTypes.includes(account.account_type)
  );

export const selectAccountTypesUsed = createSelector(
  selectSelf,
  (state: any): any[] =>
    state.accounts.accounts.map((account: any) => account.account_type)
);

// Return an array of objects ordered by group - good for passing into the "options" parameter of <Select />
export const selectAccountOptions = createSelector(
  selectSelf,
  (state: any): any[] => {
    const groups: string[] = selectAccountTypeGroups(state);

    const orderedGroups: string[] = JSON.parse(JSON.stringify(groups)).sort();

    let groupings: any = {};

    const accountRows: any[] = selectAccounts(state);

    const accountTypeToGroup: any = selectAccountTypes(state).reduce(
      (accumulator: any, currentValue: any) => {
        const accountType = currentValue.name;
        const accountGroup = currentValue.group;
        accumulator[accountType] = accountGroup;
        return accumulator;
      },
      {}
    );

    if (Object.keys(accountRows).length === 0) {
      return [];
    }
    accountRows.forEach((row) => {
      const accountGroup = accountTypeToGroup[row.account_type];
      if (!(accountGroup in groupings)) {
        groupings[accountGroup] = [];
      }
      groupings[accountGroup].push({
        label: row.name,
        value: row.id,
      });
    });

    let optionGroups: any[] = orderedGroups.map((group: string) => {
      return {
        label: group,
        options: groupings[group].sort((a: any, b: any) => {
          if (a.label < b.label) {
            return -1;
          } else if (a.label > b.label) {
            return 1;
          }
          return 0;
        }),
      };
    });

    console.log(optionGroups);
    return optionGroups;
  }
);
