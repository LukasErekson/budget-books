import { OptionsOrGroups } from 'react-select';
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
// Return an array of objects ordered by group - good for passing into the "options" parameter of <Select />
export const selectAccountTypeByGroups = (
  state: RootState
): OptionsOrGroups<number, any> => {
  const groups: string[] = selectAccountTypeGroups(state);

  const orderedGroups: string[] = JSON.parse(JSON.stringify(groups)).sort();

  const groupings: {
    [accountGroup: string]: { label: string; value: number | string }[];
  } = {};

  const accountTypeRows: AccountType[] = selectAccountTypes(state);

  if (Object.keys(accountTypeRows).length === 0) {
    return [];
  }
  accountTypeRows.forEach((row: AccountType) => {
    if (!(row.group_name in groupings)) {
      groupings[row.group_name] = [];
    }
    groupings[row.group_name].push({ label: row.name, value: row.id });
  });

  const optionGroups: OptionsOrGroups<number, any> = orderedGroups.map(
    (group) => {
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
