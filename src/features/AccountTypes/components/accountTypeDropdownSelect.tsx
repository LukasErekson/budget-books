import React from 'react';

import { useSelector } from 'react-redux';
import Select, { OptionsOrGroups } from 'react-select';

import AccountType from '../types/types';

import { RootState } from '../../../stores/store';
import {
  selectAccountTypeByGroups,
  selectAccountTypeNames,
  selectAccountTypes,
} from '../stores/accountTypeSelectors';

<<<<<<< HEAD
function AccountTypeDropdownSelector(props: {
  setCategory: React.Dispatch<
    React.SetStateAction<{ label: string; value: number }>
  >;
=======
function AccountTypeDropdownSelect(props: {
  setCategory: Function;
>>>>>>> 63dc2b3 ([Issue #15] Reorganize file structure for tests)
  category: { label: string; value: number };
  setInputCategory: React.Dispatch<React.SetStateAction<string>>;
  inputCategory: string;
  name: string;
}): JSX.Element {
  const options: OptionsOrGroups<number, any> = useSelector(
    (state: RootState) => selectAccountTypeByGroups(state)
  );

  const accountTypes: AccountType[] = useSelector((state: RootState) =>
    selectAccountTypes(state)
  );
  const accountTypeNames: string[] = useSelector((state: RootState) =>
    selectAccountTypeNames(state)
  );

  if (Object.keys(props.category).length === 0) {
    props.setCategory(options[0].options[0]);
  }

  return (
    <Select
      name={'accountType'}
      options={options.concat({
        label: 'New Category',
        options: [
          {
            label: `Create new category: ${props.inputCategory}`,
            value: -1,
          },
        ],
      })}
      onInputChange={(newValue: string) => props.setInputCategory(newValue)}
      value={props.category}
      onChange={(newCategory: any) => {
        // Allow for a new category.
        if (newCategory.value === -1) {
          newCategory.label = newCategory.label.slice(21);
          if (newCategory.label === '') {
            return;
          }
          if (accountTypeNames.includes(newCategory.label)) {
            const matchingAccountType: AccountType = accountTypes.filter(
              (accountTypeObject: AccountType) =>
                accountTypeObject.name === newCategory.label
            )[0];
            props.setCategory({
              label: matchingAccountType.name,
              value: Number(matchingAccountType.id),
            });
            return;
          }
        }
        props.setCategory(newCategory);
      }}
    />
  );
}

export default AccountTypeDropdownSelect;
