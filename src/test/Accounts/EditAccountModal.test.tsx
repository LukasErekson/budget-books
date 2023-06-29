import React from 'react';
import Account from '../../features/Accounts/types/types';
import AccountType from '../../features/AccountTypes/types/types';

import { EditAccountModal } from '../../features/Accounts';

import { RootState, setupStore } from '../../stores/store';
import { screen } from '@testing-library/react';

import * as AccountThunks from '../../features/Accounts/stores/accountThunks';

import {
  fakePromise,
  mockThunkReturn,
  renderWithProviders,
} from '../setupTests';

import * as DataFetch from '../../utils/DataFetch';

import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import ReactModal from 'react-modal';
ReactModal.setAppElement('body');

describe('EditAccountModal Component', () => {
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
      pageSlice: {
        accountSettingsPage: {
          activeAccount: fakeAccounts[0],
          EditAccountModalIsOpen: false,
        },
      },
    });
  });

  afterEach(() => {
    DataFetchMock.mockClear();
  });

  it('Renders without error', async () => {
    renderWithProviders(
      <div id='root'>
        <EditAccountModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    // Title renders correctly
    expect(await screen.findByText('Edit Account')).toBeDefined();

    // Form controls render properly
    ['Account Name:', 'Account Type:', 'Increases with Debits?'].forEach(
      async (label: string) => {
        const formLabel = await screen.findByText(label);
        expect(formLabel).toBeDefined();
      }
    );

    // Expect active account in store to populate the form data.
    const state: RootState = testStore.getState();

    const activeStateAccount: Account =
      state.pageSlice.accountSettingsPage.activeAccount;

    const accountName = (await screen.findByLabelText(
      'Account Name:'
    )) as HTMLInputElement;
    expect(accountName.value).toEqual(activeStateAccount.name);

    const accountType = await screen.findByText(
      activeStateAccount.account_type
    );
    expect(accountType).toBeDefined();

    const debitInc = (await screen.findByLabelText(
      'Increases with Debits?'
    )) as HTMLInputElement;
    expect(debitInc.value === 'on' ? true : false).toEqual(
      activeStateAccount.debit_inc
    );
  });

  it('Dispatches the putUpdatedAccountInfo thunk request on submit', async () => {
    const putUpdatedAccountInfoMock = jest.spyOn(
      AccountThunks,
      'putUpdatedAccountInfo'
    );
    putUpdatedAccountInfoMock.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <div id='root'>
        <EditAccountModal isOpen={true} onRequestClose={() => null} />
      </div>,
      { store: testStore }
    );

    const accountName = (await screen.findByLabelText(
      'Account Name:'
    )) as HTMLInputElement;

    const newAccountName = 'This is a new account name';
    await userEvent.clear(accountName);
    await userEvent.type(accountName, newAccountName);

    expect(accountName.value).toEqual(newAccountName);

    const saveButton = (await screen.findByText('Save')) as HTMLButtonElement;

    await userEvent.click(saveButton);

    expect(putUpdatedAccountInfoMock).toHaveBeenCalled();
    putUpdatedAccountInfoMock.mockClear();
  });

  it('Does not submit an empty Account Name Field', async () => {
    const putEditedAccountInfoMock = jest.spyOn(
      AccountThunks,
      'putUpdatedAccountInfo'
    );
    putEditedAccountInfoMock.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <div id='root'>
        <ToastContainer />
        <EditAccountModal isOpen={true} onRequestClose={() => null} />
      </div>
    );

    const accountNameField: HTMLInputElement = await screen.findByLabelText(
      'Account Name:'
    );

    await userEvent.clear(accountNameField);

    const saveButton: HTMLButtonElement = await screen.findByText('Save');

    await userEvent.click(saveButton);

    expect(putEditedAccountInfoMock).not.toHaveBeenCalled();

    expect(
      await screen.findByText('Cannot save an empty Account Name')
    ).toBeDefined();
    putEditedAccountInfoMock.mockClear();
  });

  it('"Delete Account" opens a confirmation dialog', async () => {
    renderWithProviders(
      <div id='root'>
        <ToastContainer />
        <EditAccountModal isOpen={true} onRequestClose={() => null} />
      </div>
    );

    const deleteButton: HTMLButtonElement = await screen.findByText(
      'Delete Account'
    );

    await userEvent.click(deleteButton);

    expect(
      await screen.findByText(/Are you sure you want to delete/i)
    ).toBeDefined();
  });

  describe('Opening the delete account confirmation dialog', () => {
    it('Clicking "No" closes the dialog', async () => {
      renderWithProviders(
        <div id='root'>
          <ToastContainer />
          <EditAccountModal isOpen={true} onRequestClose={() => null} />
        </div>
      );

      const deleteButton: HTMLButtonElement = await screen.findByText(
        'Delete Account'
      );

      await userEvent.click(deleteButton);

      const noButton: HTMLButtonElement = await screen.findByText('No');

      await userEvent.click(noButton);

      expect(noButton).not.toBeVisible();
    });

    it('Clicking "Yes" dispatches the the delete thunk and closes the dialog', async () => {
      const deleteAccountMock = jest.spyOn(AccountThunks, 'deleteAccount');
      deleteAccountMock.mockReturnValue(mockThunkReturn);

      renderWithProviders(
        <div id='root'>
          <ToastContainer />
          <EditAccountModal isOpen={true} onRequestClose={() => null} />
        </div>
      );

      const deleteButton: HTMLButtonElement = await screen.findByText(
        'Delete Account'
      );

      await userEvent.click(deleteButton);

      const yesButton: HTMLButtonElement = await screen.findByText('Yes');

      await userEvent.click(yesButton);

      expect(deleteAccountMock).toHaveBeenCalled();

      expect(yesButton).not.toBeVisible();
    });
  });
});
