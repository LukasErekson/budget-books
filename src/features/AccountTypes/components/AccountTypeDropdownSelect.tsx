import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { Autocomplete, TextField, createFilterOptions } from '@mui/material';

import AccountType from '../types/types';

import { RootState } from '../../../stores/store';
import { selectAccountTypes } from '../stores/accountTypeSelectors';
import { useThunkDispatch } from '../../../hooks/hooks';
import { fetchAccountTypes } from '../stores/accountTypeThunks';

function AccountTypeDropdownSelect(props: {
  setValue: (newValue: AccountType | null) => void;
  value: AccountType | null;
  id?: string;
}): JSX.Element {
  const accountTypes: AccountType[] = useSelector((state: RootState) =>
    selectAccountTypes(state)
  );

  const newAccountType: AccountType = {
    id: -1,
    name: '',
    group_name: 'Create New Account Type',
  };

  const thunkDispatch = useThunkDispatch();

  useEffect(() => {
    if (!accountTypes.length) {
      thunkDispatch(fetchAccountTypes('all'));
    }
  }, []);

  return (
    <Autocomplete
      size='small'
      value={props.value}
      onChange={(event, newValue) => {
        if (!newValue) {
          props.setValue(null);
          return;
        }
        if (typeof newValue === 'string') {
          props.setValue({ ...newAccountType, name: newValue });
        } else if ('inputValue' in newValue) {
          props.setValue({
            ...newAccountType,
            name: newValue.inputValue as string,
          });
        } else {
          props.setValue(newValue);
        }
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
      className={'account-type-dropdown'}
      id={props.id}
      options={[...accountTypes].sort(
        (accountTypeA: AccountType, accountTypeB: AccountType) => {
          return accountTypeA.group_name.localeCompare(accountTypeB.group_name);
        }
      )}
      filterOptions={(options: AccountType[], params) => {
        const filtered = createFilterOptions<AccountType>()(options, params);

        const { inputValue } = params;
        const accountTypeExists = options.some(
          (option) => inputValue == option.name
        );

        if (inputValue !== '' && !accountTypeExists) {
          filtered.push({ ...newAccountType, name: inputValue });
        }

        return filtered;
      }}
      groupBy={(option: AccountType | string) =>
        typeof option === 'string' ? '' : option.group_name || ''
      }
      getOptionLabel={(option: AccountType | string) =>
        typeof option === 'string'
          ? option
          : 'inputValue' in option
          ? (option.inputValue as string)
          : option.name || ''
      }
      renderInput={(params) => (
        <TextField
          {...params}
          size='small'
          placeholder='Account Type'
          InputLabelProps={{ hidden: true }}
          variant='outlined'
        />
      )}
    />
  );
}

export default AccountTypeDropdownSelect;
