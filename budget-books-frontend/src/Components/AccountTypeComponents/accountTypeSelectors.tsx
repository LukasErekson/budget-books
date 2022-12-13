import { OptionsOrGroups } from 'react-select';
import { RootState } from '../../store';
import AccountType from './accountTypeTSTypes';

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
): OptionsOrGroups<Number, any> => {
  const groups: string[] = selectAccountTypeGroups(state);

  const orderedGroups: string[] = JSON.parse(JSON.stringify(groups)).sort();

  let groupings: {
    [accountGroup: string]: { label: string; value: number | string }[];
  } = {};

  const accountTypeRows: AccountType[] = selectAccountTypes(state);

  if (Object.keys(accountTypeRows).length === 0) {
    return [];
  }
  accountTypeRows.forEach((row: AccountType) => {
    if (!(row.group in groupings)) {
      groupings[row.group] = [];
    }
    groupings[row.group].push({ label: row.name, value: row.id });
  });

  let optionGroups: OptionsOrGroups<Number, any> = orderedGroups.map(
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
