import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { connect } from 'react-redux';
import { fetchAccountTypes } from '../AccountTypeComponents/accountTypeThunks';
import { addNewAccount } from './accountThunks';
import {
  selectAccountTypes,
  selectAccountTypeByGroups,
  selectAccountTypeNames,
} from '../AccountTypeComponents/accountTypeSelectors';
import { FiHelpCircle } from 'react-icons/fi';
import AccountTypeSelect from '../AccountTypeComponents/accountTypeSelect';

function NewAccountModal(props: {
  isOpen: boolean;
  onRequestClose: any;
  fetchAccountTypes: Function;
  addNewAccount: Function;
  selectAccountTypes: any[];
  selectAccountTypeByGroups: any[];
  selectAccountTypeNames: string[];
}): JSX.Element {
  const [category, setCategory]: [any, Function] = useState({});
  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  const [accountName, setAccountName]: [string, Function] = useState('');

  const [debitInc, setDebitInc]: [boolean, Function] = useState(true);

  function postNewAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountName.length === 0) {
      alert('Please input an account name!');
      return;
    }

    props.addNewAccount(accountName, category, debitInc);

    setAccountName('');

    props.onRequestClose();
  }

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        appElement={document.getElementById('root') || undefined}
        style={{ content: { height: 'fit-content' } }}
      >
        <h1 className='center'>Add New Account</h1>
        <form
          className='modal-form'
          onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
            postNewAccount(event)
          }
        >
          <label htmlFor='accountName'>Account Name:</label>
          <div className='modal-input'>
            <input
              type='text'
              name='accountName'
              value={accountName}
              placeholder='Account Name...'
              onChange={(event: any) => setAccountName(event.target.value)}
            />
          </div>
          <br />
          <label htmlFor='accountType'>Category:</label>
          <AccountTypeSelect
            setCategory={setCategory}
            category={category}
            setInputCategory={setInputCategory}
            inputCategory={inputCategory}
          />
          <br />
          <div className='modal-input'>
            <label htmlFor='debitInc'>Balance increases with debits?</label>
            <abbr
              title={
                'This is typically true for bank accounts and expenses, but it is not true for credit cards, loans, and other liabilities.'
              }
            >
              <FiHelpCircle />
            </abbr>
            <input
              type='checkbox'
              name='debitInc'
              id='debitIncCB'
              checked={debitInc}
              onChange={() => setDebitInc(!debitInc)}
            />
          </div>

          <div className='center'>
            <button className={'modal-btn'} type='submit'>
              Add Account
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {
    selectAccountTypes: selectAccountTypes(state),
    selectAccountTypeByGroups: selectAccountTypeByGroups(state),
    selectAccountTypeNames: selectAccountTypeNames(state),
  };
};

const mapDipsatchToProps = (dispatch: Function) => {
  return {
    fetchAccountTypes: (group: string) => dispatch(fetchAccountTypes(group)),
    addNewAccount: (name: string, account_type: any, debit_inc: boolean) =>
      dispatch(addNewAccount(name, account_type, debit_inc)),
  };
};

export default connect(mapStateToProps, mapDipsatchToProps)(NewAccountModal);
