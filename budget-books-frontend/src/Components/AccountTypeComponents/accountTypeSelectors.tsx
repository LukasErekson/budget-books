import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const selectSelf = (state: RootState) => state;

// Return the account type objects of the form {id: #, name: '', group: ''}
export const selectAccountTypes = createSelector(
    selectSelf,
    (state: any) => state.accountTypes.accountTypes
);

// Return an array of the unique group names.
export const selectAccountTypeGroups = createSelector(
    selectSelf,
    (state: any): string[] => state.accountTypes.accountGroups
);

// Return an array of the account labels.
export const selectAccountTypeNames = createSelector(
    selectSelf,
    (state: any): string[] =>
        state.accountTypes.accountTypes.map(
            (accountTypeGroup: any) => accountTypeGroup.name
        )
);
// Return an array of objects ordered by group - good for passing into the "options" parameter of <Select />
export const selectAccountTypeByGroups = createSelector(
    selectSelf,
    (state: any): any[] => {
        const groups: string[] = selectAccountTypeGroups(state);

        const orderedGroups: string[] = JSON.parse(
            JSON.stringify(groups)
        ).sort();

        let groupings: any = {};

        const accountTypeRows: any[] = selectAccountTypes(state);

        if (Object.keys(accountTypeRows).length === 0) {
            return [];
        }
        accountTypeRows.forEach((row) => {
            if (!(row.group in groupings)) {
                groupings[row.group] = [];
            }
            groupings[row.group].push({ label: row.name, value: row.id });
        });

        let optionGroups: any[] = orderedGroups.map((group) => {
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

        return optionGroups;
    }
);
