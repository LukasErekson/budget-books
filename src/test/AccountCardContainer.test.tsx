import { fireEvent, screen } from '@testing-library/react';

import Account from '../features/Accounts/types/types';
import { AccountCardContainer } from '../features/Accounts';
import * as AccountThunks from '../features/Accounts/stores/accountThunks';
import * as AccountTypeThunks from '../features/AccountTypes/stores/accountTypeThunks';
import * as TransactionThunks from '../features/Transactions/stores/transactionThunks';

import { RootState, setupStore } from '../stores/store';
import { renderWithProviders } from './setupTests';
import * as DataFetch from '../utils/DataFetch';
import AccountType from '../features/AccountTypes/types/types';

describe('AccountCardContainer Component', () => {
  let DataFetchMock = jest.spyOn(DataFetch, 'default');
  let testStore: RootState;

  const fakePromise: Promise<any> = new Promise(() => {});

  beforeAll(() => {
    DataFetchMock.mockImplementation(
      (method: string, url: RequestInfo, requestData?: any) => {
        return {
          cancel: () => {},
          responsePromise: fakePromise,
        };
      }
    );

    let fakeAccounts: Account[] = [
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

    let fakeAccountTypes: AccountType[] = [
      {
        id: 1,
        name: 'Checking Account',
        group: 'Assets',
      },
      {
        id: 2,
        name: 'Credit Card',
        group: 'Liabilities',
      },
    ];
    testStore = setupStore({
      accounts: { accounts: fakeAccounts },
      accountTypes: {
        accountTypes: fakeAccountTypes,
        accountGroups: fakeAccountTypes.map((accountType) => accountType.group),
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
    let fetchAccountsMock = jest.spyOn(AccountThunks, 'fetchAccounts');
    fetchAccountsMock.mockReturnValue(() => fakePromise);

    let fetchAccountTypesMock = jest.spyOn(
      AccountTypeThunks,
      'fetchAccountTypes'
    );
    fetchAccountTypesMock.mockReturnValue(() => fakePromise);

    let fetchBankAccountTransactionsMock = jest.spyOn(
      TransactionThunks,
      'fetchBankAccountTransactions'
    );
    fetchBankAccountTransactionsMock.mockReturnValue(() => fakePromise);

    renderWithProviders(<AccountCardContainer />, { store: testStore });

    expect(fetchAccountsMock).toHaveBeenCalledTimes(1);
    expect(fetchAccountTypesMock).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Fake Account 1')).toBeDefined();
  });

  it('Updates the active account on clicking an account card', async () => {
    let state: RootState = testStore.getState();

    renderWithProviders(<AccountCardContainer />, { store: testStore });

    expect(state.pageSlice.categorizationPage.activeAccount).toEqual({});

    let firstAccount = await screen.findByText('Fake Account 1');
    fireEvent.click(firstAccount);

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
    let fetchAccountsMock = jest.spyOn(AccountThunks, 'fetchAccounts');
    fetchAccountsMock.mockReturnValue(() => fakePromise);

    let fetchAccountTypesMock = jest.spyOn(
      AccountTypeThunks,
      'fetchAccountTypes'
    );
    fetchAccountTypesMock.mockReturnValue(() => fakePromise);

    let fetchBankAccountTransactionsMock = jest.spyOn(
      TransactionThunks,
      'fetchBankAccountTransactions'
    );
    fetchBankAccountTransactionsMock.mockReturnValue(() => fakePromise);

    renderWithProviders(
      <div id='root'>
        <AccountCardContainer />
      </div>,
      { store: testStore }
    );

    let newAccountButton = await screen.findByText(/Add New Account/i);
    fireEvent.click(newAccountButton);

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
