import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { NewAccountModal } from '../../features/Accounts';
import * as AccountThunks from '../../features/Accounts/stores/accountThunks';

import { RootState, setupStore } from '../../stores/store';
import {
  fakePromise,
  mockThunkReturn,
  renderWithProviders,
} from '../setupTests';
import * as DataFetch from '../../utils/DataFetch';
import AccountType from '../../features/AccountTypes/types/types';

import ReactModal from 'react-modal';
import userEvent from '@testing-library/user-event';
ReactModal.setAppElement('body');

describe('NewAccountModal Component', () => {
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
      },
      {
        id: 2,
        name: 'Fake Account 2',
        account_type_id: 2,
        account_type: 'Credit Card',
        debit_inc: false,
        balance: -10.27,
        last_updated: '2022-02-22',
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
        <NewAccountModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    // Title renders properly
    expect(await screen.findByText('Add New Account')).toBeDefined();

    // Form controls render properly
    // Expect to find each of the modal's form components
    ['Account Name:', 'Category:', 'Balance increases with debits?'].forEach(
      async (label: string) => {
        const formLabel = await screen.findByText(label);
        expect(formLabel).toBeDefined();
      }
    );
    // New category defaults to "Misc. Accounts"
    expect(await screen.findByText('Misc. Accounts')).toBeDefined();
  });

  it('Populates the AccountType dropdown select correctly', async () => {
    renderWithProviders(
      <div id='root'>
        <NewAccountModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    const accountTypeDropdown = await screen.findByText('Misc. Accounts');
    await userEvent.click(accountTypeDropdown);

    fakeAccountTypes.forEach(async (accountType: AccountType) => {
      expect(await screen.findByText(accountType.name)).toBeVisible();
    });
  });

  it('Reports a problem if Account Name is blank', async () => {
    const alertMock = jest.spyOn(window, 'alert');
    alertMock.mockImplementation((message: string) => message);

    renderWithProviders(
      <div id='root'>
        <NewAccountModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    const accountName = (await screen.findByPlaceholderText(
      'Account Name...'
    )) as HTMLInputElement;
    expect(accountName.value).toEqual('');

    const submitButton = await screen.findByText('Add Account');
    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith('Please input an account name!');
  });

  it('Calls the addNewAccount thunk upon submission', async () => {
    const addNewAccount = jest.spyOn(AccountThunks, 'addNewAccount');
    addNewAccount.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <div id='root'>
        <NewAccountModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    const accountName = (await screen.findByPlaceholderText(
      'Account Name...'
    )) as HTMLInputElement;
    expect(accountName.value).toEqual('');

    await userEvent.type(accountName, 'Jest Testing Fees');

    expect(accountName.value).toEqual('Jest Testing Fees');

    const submitButton = await screen.findByText('Add Account');
    await userEvent.click(submitButton);

    expect(addNewAccount).toHaveBeenCalled();

    expect(addNewAccount).toHaveBeenCalledWith(
      'Jest Testing Fees',
      { label: 'Misc. Accounts', value: -1 },
      true
    );
  });
});
