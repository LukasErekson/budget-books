import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const selectSelf = (state: RootState) => state;

export const selectAccountTypes = (state: any) =>
    state.accountTypes.accountTypes;

export const selectAccountTypeGroups = createSelector(
    selectSelf,
    (state: any) => state.accountTypes.accountGroups
);

export const selectAccountTypeByGroups = createSelector(
    selectSelf,
    (state: any) => {
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
