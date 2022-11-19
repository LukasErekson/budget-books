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
        let groupings: any = {};

        const accountTypeRows: any[] = selectAccountTypes(state);

        accountTypeRows.forEach((row) => {
            if (!(row.group in groupings)) {
                groupings[row.group] = [];
            }
            groupings[row.group].push({ label: row.name, value: row.id });
        });

        let optionGroups: any[] = groups.map((group) => {
            return { label: group, options: groupings[group] };
        });

        return optionGroups;
    }
);
