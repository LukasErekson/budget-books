import React, { useState } from 'react';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { useSelector } from 'react-redux';

import Account from '../types/types';

import { RootState } from '../../../stores/store';

function AccountDropdownSelect(props: {
  excludeAccount: Account;
  value: Account;
  setValue: (newValue: Account) => void;
  inputValue: string;
  setInputValue: (newInput: string) => void;
}): JSX.Element {
  const accounts: Account[] = useSelector(
    (state: RootState) => state.accounts.accounts
  );

  const defaultAccount = (
    Object.keys(props.excludeAccount) as (keyof Account)[]
  ).every(
    (property: keyof Account) =>
      props.excludeAccount[property] === accounts[0][property]
  )
    ? accounts[1]
    : accounts[0];

  const newAccount: Account = {
    name: '',
    id: -1,
    account_group: 'Create New Account',
    account_type: 'New',
    account_type_id: -1,
    debit_inc: true,
    balance: 0,
    last_updated: '',
  };

  // TODO : Custom options https://mui.com/material-ui/react-autocomplete/#creatable
  // TODO : Add Dialog Logic? Maybe the new account modal? Could be good!

  return (
    <Autocomplete
      size='small'
      value={props.value || defaultAccount}
      onChange={(event, newValue) => {
        if (typeof newValue !== 'string' && newValue) {
          props.setValue(newValue);
        }
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
      className='account-dropdown'
      inputValue={props.inputValue}
      onInputChange={(event, newValue) => props.setInputValue(newValue)}
      options={accounts
        .filter((account: Account) =>
          (Object.keys(props.excludeAccount) as (keyof Account)[]).some(
            (property: keyof Account) =>
              props.excludeAccount[property] !== account[property]
          )
        )
        .sort((account1: Account, account2: Account) =>
          account1.account_group.localeCompare(account2.account_group)
        )}
      filterOptions={(options: Account[], params) => {
        const filtered = createFilterOptions<Account>()(options, params);
        const { inputValue } = params;

        const accountExists = options.some(
          (option) => inputValue === option.name
        );

        if (inputValue !== '' && !accountExists) {
          filtered.push({ ...newAccount, name: `${inputValue}` });
        }

        return filtered;
      }}
      groupBy={(option: Account | string) =>
        typeof option === 'string' ? '' : option.account_group || ''
      }
      getOptionLabel={(option: Account | string) =>
        typeof option === 'string' ? option : option.name || ''
      }
      renderInput={(params) => (
        <TextField
          {...params}
          size='small'
          placeholder='Account'
          InputLabelProps={{ hidden: true }}
          variant='outlined'
        />
      )}
    />
  );
}

export default AccountDropdownSelect;
