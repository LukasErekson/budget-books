import React from 'react';
import { act, screen } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { AccountCardContainer } from '../../features/Accounts';
import * as AccountThunks from '../../features/Accounts/stores/accountThunks';
import * as AccountTypeThunks from '../../features/AccountTypes/stores/accountTypeThunks';
import * as TransactionThunks from '../../features/Transactions/stores/transactionThunks';

import { RootState, setupStore } from '../../stores/store';
import {
  fakePromise,
  mockThunkReturn,
  renderWithProviders,
} from '../setupTests';
import * as DataFetch from '../../utils/DataFetch';
import AccountType from '../../features/AccountTypes/types/types';
import userEvent from '@testing-library/user-event/';

describe('AccountCardContainer Component', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');
  let testStore: RootState;

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

    const fakeAccountTypes: AccountType[] = [
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
    renderWithProviders(<AccountCardContainer />);

    expect(DataFetchMock).toHaveBeenCalledTimes(2);

    expect(DataFetchMock).toHaveReturnedTimes(2);

    expect(await screen.findByText(/loading accounts.../i)).toBeDefined();
  });

  it('Displays account cards with loaded accounts', async () => {
    const fetchAccountsMock = jest.spyOn(AccountThunks, 'fetchAccounts');
    fetchAccountsMock.mockReturnValue(mockThunkReturn);

    const fetchAccountTypesMock = jest.spyOn(
      AccountTypeThunks,
      'fetchAccountTypes'
    );
    fetchAccountTypesMock.mockReturnValue(mockThunkReturn);

    const fetchBankAccountTransactionsMock = jest.spyOn(
      TransactionThunks,
      'fetchBankAccountTransactions'
    );
    fetchBankAccountTransactionsMock.mockReturnValue(mockThunkReturn);

    renderWithProviders(<AccountCardContainer />, { store: testStore });

    expect(fetchAccountTypesMock).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Fake Account 1')).toBeDefined();
  });

  it('Updates the active account on clicking an account card', async () => {
    let state: RootState = testStore.getState();

    renderWithProviders(<AccountCardContainer />, { store: testStore });

    expect(state.pageSlice.categorizationPage.activeAccount).toEqual({});

    const firstAccount = await screen.findByText('Fake Account 1');
    await act(async () => {
      await userEvent.click(firstAccount);
    });

    state = testStore.getState();

    expect(state.pageSlice.categorizationPage.activeAccount).toEqual({
      id: 1,
      name: 'Fake Account 1',
      account_type_id: 1,
      account_type: 'Checking Account',
      debit_inc: true,
      balance: 10.27,
      last_updated: '2022-02-22',
    });
  });

  it('Opens the new account modal on click', async () => {
    const fetchAccountsMock = jest.spyOn(AccountThunks, 'fetchAccounts');
    fetchAccountsMock.mockReturnValue(mockThunkReturn);

    const fetchAccountTypesMock = jest.spyOn(
      AccountTypeThunks,
      'fetchAccountTypes'
    );
    fetchAccountTypesMock.mockReturnValue(mockThunkReturn);

    const fetchBankAccountTransactionsMock = jest.spyOn(
      TransactionThunks,
      'fetchBankAccountTransactions'
    );
    fetchBankAccountTransactionsMock.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <div id='root'>
        <AccountCardContainer />
      </div>,
      { store: testStore }
    );

    const newAccountButton = await screen.findByText(/Add New Account/i);
    await act(async () => {
      await userEvent.click(newAccountButton);
    });

    // Expect to find the modal title
    expect(await screen.findAllByText(/Add New Account/i)).toBeDefined();

    // Expect to find each of the modal's form components
    [
      'Account Name',
      'Category',
      'Balance increases with debits?',
      'Add Account',
    ].forEach(async (label: string) => {
      expect(await screen.findByLabelText(label)).toBeDefined();
    });
  });
});
