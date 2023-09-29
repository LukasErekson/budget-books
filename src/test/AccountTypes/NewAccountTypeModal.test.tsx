import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import * as AccountTypeThunks from '../../features/AccountTypes/stores/accountTypeThunks';
import Account from '../../features/Accounts/types/types';
import NewAccountTypeModal from '../../features/AccountTypes/components/NewAccountTypeModal';

import AccountType from '../../features/AccountTypes/types/types';
import { RootState, setupStore } from '../../stores/store';
import * as DataFetch from '../../utils/DataFetch';
import {
  fakePromise,
  mockThunkReturn,
  renderWithProviders,
} from '../setupTests';

import userEvent from '@testing-library/user-event';
import ReactModal from 'react-modal';
ReactModal.setAppElement('body');

describe('NewAccountTypeModal Component', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');
  let testStore: RootState;

  let fakeAccountTypes: AccountType[];

  beforeAll(() => {
    DataFetchMock.mockImplementation(
      (method: string, url: RequestInfo, requestData?: any) => {
        return {
          cancel: () => null,
          responsePromise: fakePromise,
        };
      }
    );

    const fakeAccounts: Account[] = [
      {
        id: 1,
        name: 'Fake Account 1',
        account_type_id: 1,
        account_type: 'Checking Account',
        debit_inc: true,
        balance: 10.27,
        last_updated: '2022-02-22',
        account_group: 'Group 1',
      },
      {
        id: 2,
        name: 'Fake Account 2',
        account_type_id: 2,
        account_type: 'Credit Card',
        debit_inc: false,
        balance: -10.27,
        last_updated: '2022-02-22',
        account_group: 'Group 1',
      },
    ];

    fakeAccountTypes = [
      {
        id: 1,
        name: 'Checking Account',
        group_name: 'Assets',
      },
      {
        id: 2,
        name: 'Credit Card',
        group_name: 'Liabilities',
      },
    ];
    testStore = setupStore({
      accounts: { accounts: fakeAccounts },
      accountTypes: {
        accountTypes: fakeAccountTypes,
        accountGroups: fakeAccountTypes.map(
          (accountType) => accountType.group_name
        ),
      },
    });
  });

  afterEach(() => {
    DataFetchMock.mockClear();
  });

  it('Renders without error', async () => {
    renderWithProviders(
      <div id='root'>
        <NewAccountTypeModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    // Title renders properly
    expect(await screen.findByText('Add New Account Type')).toBeDefined();

    // Form controls render properly
    // Expect to find each of the modal's form components
    ['Account Type Name:', 'Account Type Group:'].forEach(
      async (label: string) => {
        const formLabel = await screen.findByText(label);
        expect(formLabel).toBeDefined();
      }
    );
    // New group defaults to "Assets"
    expect(await screen.findByText('Assets')).toBeDefined();
  });

  it('Reports a problem if Account Type Name is blank', async () => {
    const alertMock = jest.spyOn(window, 'alert');
    alertMock.mockImplementation((message: string) => message);

    renderWithProviders(
      <div id='root'>
        <NewAccountTypeModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    const accountName = (await screen.findByPlaceholderText(
      'Account Type Name...'
    )) as HTMLInputElement;
    expect(accountName.value).toEqual('');

    const submitButton = await screen.findByText('Add Account Type');
    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
      'Please input an account type name!'
    );
  });

  it('Calls the PostNewAccountType thunk upon submission', async () => {
    const addNewAccount = jest.spyOn(AccountTypeThunks, 'PostNewAccountType');
    addNewAccount.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <div id='root'>
        <NewAccountTypeModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    const accountTypeName = (await screen.findByPlaceholderText(
      'Account Type Name...'
    )) as HTMLInputElement;
    expect(accountTypeName.value).toEqual('');

    await userEvent.type(accountTypeName, 'Jest Testing Fees');

    expect(accountTypeName.value).toEqual('Jest Testing Fees');

    const submitButton = await screen.findByText('Add Account Type');
    await userEvent.click(submitButton);

    expect(addNewAccount).toHaveBeenCalled();

    expect(addNewAccount).toHaveBeenCalledWith({
      group_name: 'Assets',
      id: 3,
      name: 'Jest Testing Fees',
    });
  });
});
