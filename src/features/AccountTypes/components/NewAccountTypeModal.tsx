import React, { useEffect, useState } from 'react';

import { Button, MenuItem, Select, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import ModalBase from '../../../components/ModalBase';
import { useThunkDispatch } from '../../../hooks/hooks';
import { RootState } from '../../../stores/store';
import {
  selectAccountTypeGroups,
  selectAccountTypes,
} from '../stores/accountTypeSelectors';
import {
  PostNewAccountType,
  fetchAccountTypes,
} from '../stores/accountTypeThunks';
import AccountType from '../types/types';
import { toast } from 'react-toastify';

function NewAccountTypeModal(props: {
  isOpen: boolean;
  onRequestClose: () => void;
}): JSX.Element {
  const currentAccountTypes: AccountType[] = useSelector((state: RootState) =>
    selectAccountTypes(state)
  );

  const currentGroupNames: string[] = useSelector((state: RootState) =>
    selectAccountTypeGroups(state)
  );

  const [accountTypeName, setAccountTypeName]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState('');

  const [groupName, setGroupName]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState(currentGroupNames[0]);

  const thunkDispatch = useThunkDispatch();

  useEffect(() => {
    if (!groupName && currentGroupNames.length) {
      setGroupName(currentGroupNames[0]);
    } else if (!currentGroupNames.length) {
      // Grab account types if not fetched yet.
      thunkDispatch(fetchAccountTypes());
    }
  }, [currentGroupNames]);

  function postNewAccType(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountTypeName.length === 0) {
      toast.error('Please input an account type name!');
      return;
    }

    const newAccountType: AccountType = {
      id: currentAccountTypes.length + 1,
      name: accountTypeName,
      group_name: groupName,
    };

    thunkDispatch(PostNewAccountType(newAccountType));

    setAccountTypeName('');
    setGroupName(currentGroupNames[0]);

    props.onRequestClose();
  }

  return (
    <>
      <ModalBase
        title={'Add New Account Type'}
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
      >
        <form
          className='modal-form'
          onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
            postNewAccType(event)
          }
        >
          <label htmlFor='accountTypeName'>Account Type Name:</label>
          <div>
            <TextField
              id='accountTypeName'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              value={accountTypeName}
              placeholder='Account Type Name...'
              onChange={(
                event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => setAccountTypeName(event.target.value)}
            />
          </div>
          <br />
          <label htmlFor='accountTypeGroup'>Account Type Group:</label>
          <Select
            id='accountTypeGroup'
            variant='outlined'
            size='small'
            style={{ width: '100%' }}
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
          >
            {currentGroupNames.map((groupName: string) => {
              return (
                <MenuItem key={groupName} value={groupName}>
                  {groupName}
                </MenuItem>
              );
            })}
          </Select>
          <br />
          <br />

          <div className='center'>
            <Button variant='contained' type='submit'>
              Add Account Type
            </Button>
          </div>
        </form>
      </ModalBase>
    </>
  );
}

export default NewAccountTypeModal;
