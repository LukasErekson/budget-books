import React from 'react';

import { useSelector } from 'react-redux';
import Select, { OptionsOrGroups } from 'react-select';

import Account from '../types/types';

import { RootState } from '../../../stores/store';
import {
  selectAccountNames,
  selectAccountOptions,
} from '../stores/accountSelectors';

function AccountDropdownSelect(props: {
  setCategory: React.Dispatch<
    React.SetStateAction<{ label: string; value: number }>
  >;
  category: { label: string; value: number };
  setInputCategory: React.Dispatch<React.SetStateAction<string>>;
  inputCategory: string;
  excludeAccount: Account;
}): JSX.Element {
  const options: OptionsOrGroups<number, any> = useSelector(
    (state: RootState) => selectAccountOptions(state, props.excludeAccount)
  );

  const accountNames: string[] = useSelector((state: RootState) =>
    selectAccountNames(state)
  );

  const accounts: Account[] = useSelector(
    (state: RootState) => state.accounts.accounts
  );

  return (
    <Select
      name={'account'}
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
          if (newCategory.label.includes('Create new category: ')) {
            newCategory.label = newCategory.label.slice(21);
          }
          if (newCategory.label === '') {
            return;
          }
          if (accountNames.includes(newCategory.label)) {
            const matchingAccount: Account = accounts.filter(
              (account: Account) => account.name === newCategory.name
            )[0];
            props.setCategory({
              label: matchingAccount.name,
              value: matchingAccount.id,
            });
            return;
          }
        }

        if (newCategory.value === props.excludeAccount.id) {
          return;
        }
        props.setCategory(newCategory);
      }}
    />
  );
}

export default AccountDropdownSelect;
