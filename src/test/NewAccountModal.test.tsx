import { fireEvent, screen } from '@testing-library/react';

import Account from '../features/Accounts/types/types';
import { NewAccountModal } from '../features/Accounts';
import * as AccountThunks from '../features/Accounts/stores/accountThunks';
import * as AccountTypeThunks from '../features/AccountTypes/stores/accountTypeThunks';
import * as TransactionThunks from '../features/Transactions/stores/transactionThunks';

import { RootState, setupStore } from '../stores/store';
import { renderWithProviders } from './setupTests';
import * as DataFetch from '../utils/DataFetch';
import AccountType from '../features/AccountTypes/types/types';

import ReactModal from 'react-modal';
ReactModal.setAppElement('body');

describe('AccountCardContainer Component', () => {
  let DataFetchMock = jest.spyOn(DataFetch, 'default');
  let testStore: RootState;

  let fakeAccountTypes: AccountType[];

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

    fakeAccountTypes = [
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
    renderWithProviders(
      <div id='root'>
        <NewAccountModal isOpen={true} onRequestClose={() => {}} />
      </div>,
      { store: testStore }
    );

    // Title renders properly
    expect(await screen.findByText('Add New Account')).toBeDefined();

    // Form controls render properly
    // Expect to find each of the modal's form components
    [
      'Account Name',
      'Category',
      'Balance increases with debits?',
      'Add Account',
    ].forEach(async (label: string) => {
      expect(await screen.findByLabelText(label)).toBeDefined();
    });

    // New category defaults to "New Account"
    expect(await screen.findByText('New Account')).toBeDefined();
  });

  it('Populates the AccountType dropdown select correctly', async () => {
    renderWithProviders(
      <div id='root'>
        <NewAccountModal isOpen={true} onRequestClose={() => {}} />
      </div>,
      { store: testStore }
    );

    let accountTypeDropdown = await screen.findByText('New Account');
    fireEvent.click(accountTypeDropdown);

    fakeAccountTypes.forEach(async (accountType: AccountType) => {
      expect(await screen.findByText(accountType.name)).toBeVisible();
    });
  });
});
