import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select, { OptionsOrGroups } from 'react-select';
import {
  selectAccountNames,
  selectAccountOptions,
} from '../AccountComponents/accountSelectors';
import Account from './accountTSTypes';
import { RootState } from '../../store';

function AccountSelect(props: {
  setCategory: Function;
  category: Number;
  setInputCategory: Function;
  inputCategory: string;
  excludeAccount: Account;
}): JSX.Element {
  let options: OptionsOrGroups<Number, any> = useSelector((state: any) =>
    selectAccountOptions(state)
  );

  const accountNames: string[] = useSelector((state: RootState) =>
    selectAccountNames(state)
  );

  const accounts: Account[] = useSelector(
    (state: RootState) => state.accounts.accounts
  );

  useEffect(() => {
    props.setCategory(options[0].options[0]);
  }, []);

  console.log(accountNames);

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

export default AccountSelect;
