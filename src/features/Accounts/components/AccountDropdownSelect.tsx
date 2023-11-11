import React from 'react';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { useSelector } from 'react-redux';

import Account from '../types/types';

import { RootState } from '../../../stores/store';

function AccountDropdownSelect(props: {
  value: Account | null;
  setValue: (newValue: Account) => void;
  inputValue: string;
  setInputValue: (newInput: string) => void;
  excludeAccount?: Account | null;
  label?: string;
  useDefaultAccount?: boolean;
}): JSX.Element {
  const accounts: Account[] = useSelector(
    (state: RootState) => state.accounts.accounts
  );

  const excludeAccount: Account =
    props.excludeAccount || ({ id: -1 } as Account); // This will never match an account

  const defaultAccount = excludeAccount
    ? (Object.keys(excludeAccount) as (keyof Account)[]).every(
        (property: keyof Account) =>
          excludeAccount
            ? excludeAccount[property] === accounts[0][property]
            : false
      )
      ? accounts[1]
      : accounts[0]
    : accounts[0];

  const newAccount: Account = {
    name: '',
    id: -1,
    account_group: 'Create New Account',
    account_type: 'New Account',
    account_type_id: -1,
    debit_inc: true,
    balance: 0,
    last_updated: '',
  };

  // TODO : Custom options https://mui.com/material-ui/react-autocomplete/#creatable
  // TODO : Add Dialog Logic? Maybe the new account modal? Could be good!

  return (
    <div>
      <Autocomplete
        size='small'
        value={props.value || (props.useDefaultAccount ? defaultAccount : null)}
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
        options={(props.excludeAccount
          ? accounts.filter((account: Account) => {
              const excludeAccount =
                props.excludeAccount || ({ id: -1 } as Account);
              return (Object.keys(excludeAccount) as (keyof Account)[]).some(
                (property: keyof Account) =>
                  excludeAccount[property] !== account[property]
              );
            })
          : [...accounts]
        ).sort((account1: Account, account2: Account) =>
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
            label={props.label || 'Account'}
            size='small'
            placeholder='Account'
            InputLabelProps={{ hidden: true }}
            variant='outlined'
          />
        )}
      />
    </div>
  );
}

export default AccountDropdownSelect;
