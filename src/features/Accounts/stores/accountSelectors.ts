import { OptionsOrGroups } from 'react-select';
import { RootState } from '../../../stores/store';
import {
  selectAccountTypeGroups,
  selectAccountTypes,
} from '../../AccountTypes/stores/accountTypeSelectors';
import AccountType from '../../AccountTypes/types/types';
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

// Return an array of objects ordered by group - good for passing into the "options" parameter of <Select />
export const selectAccountOptions = (
  state: RootState,
  excludeAccount?: Account
): OptionsOrGroups<number, any> => {
  const groups: string[] = selectAccountTypeGroups(state);

  const orderedGroups: string[] = JSON.parse(JSON.stringify(groups)).sort();

  const groupings: {
    [accountGroup: string]: { label: string; value: number | string }[];
  } = {};

  const accountRows: Account[] = selectAccounts(state);

  const accountTypeToGroup: { [accountType: string]: string } =
    selectAccountTypes(state).reduce(
      (
        accumulator: { [accountType: string]: string },
        currentValue: AccountType
      ) => {
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

  accountRows.forEach((row: Account) => {
    const accountGroup = accountTypeToGroup[row.account_type];
    if (!(accountGroup in groupings)) {
      groupings[accountGroup] = [];
    }
    if (row.id !== excludeAccount?.id) {
      groupings[accountGroup].push({
        label: row.name,
        value: row.id,
      });
    }
  });

  const optionGroups: OptionsOrGroups<number, any> = orderedGroups.map(
    (group: string) => {
      return {
        label: group,
        options: groupings[group].sort(
          (a: { label: string }, b: { label: string }) => {
            if (a.label < b.label) {
              return -1;
            } else if (a.label > b.label) {
              return 1;
            }
            return 0;
          }
        ),
      };
    }
  );

  return optionGroups;
};
