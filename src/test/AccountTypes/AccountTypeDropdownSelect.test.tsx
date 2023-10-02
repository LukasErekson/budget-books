import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { AccountTypeDropdownSelect } from '../../features/AccountTypes';

import { RootState, setupStore } from '../../stores/store';
import { renderWithProviders } from '../setupTests';
import AccountType from '../../features/AccountTypes/types/types';
import * as AccountTypeSelectors from '../../features/AccountTypes/stores/accountTypeSelectors';
import { fakeAccounts } from '../Accounts/mockAccounts';
import userEvent from '@testing-library/user-event';

describe('AccountDropdownSelect Component', () => {
  let testStore: RootState;
  const fakeAccountTypes: AccountType[] = [];
  let testAccounts: Account[];

  let category: AccountType;
  const setCategoryMock: jest.Mock<any, any, any> = jest.fn(
    (newValue: AccountType) => {
      category = newValue;
    }
  );

  beforeAll(() => {
    testAccounts = JSON.parse(JSON.stringify(fakeAccounts));

    fakeAccounts.forEach((account: Account) => {
      const accountType: AccountType = {
        id: account.account_type_id,
        group_name: account.account_group,
        name: account.account_type,
      };

      if (
        !fakeAccountTypes.some(
          (accType: AccountType) => accType.id === accountType.id
        )
      ) {
        fakeAccountTypes.push(accountType);
      }
    });

    category = fakeAccountTypes[0];

    testStore = setupStore({
      accounts: { accounts: testAccounts },
      accountTypes: {
        accountTypes: fakeAccountTypes,
        accountGroups: fakeAccountTypes.map(
          (accountType) => accountType.group_name
        ),
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Renders without error', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        value={category}
        setValue={setCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = (await screen.findByPlaceholderText(
      'Account Type'
    )) as HTMLInputElement;

    expect(dropdown).toBeVisible();
  });

  it('Displays all options on click', async () => {
    const selectMock = jest.spyOn(AccountTypeSelectors, 'selectAccountTypes');

    renderWithProviders(
      <AccountTypeDropdownSelect
        value={category}
        setValue={setCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByPlaceholderText('Account Type');

    expect(selectMock).toHaveBeenCalled();

    await userEvent.click(dropdown);

    expect(await screen.findByText('Checking Account')).toBeVisible();
    expect(await screen.findByText('Credit Card')).toBeVisible();
    expect(await screen.findByText('Group 1')).toBeVisible();
    expect(await screen.findByText('Group 2')).toBeVisible();
  });

  it('Updates account type on click', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        value={category}
        setValue={setCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByPlaceholderText('Account Type');

    await userEvent.click(dropdown);

    const accountType = await screen.findByText(fakeAccountTypes[1].name);

    await userEvent.click(accountType);

    expect(setCategoryMock).toHaveBeenCalledWith({
      ...fakeAccountTypes[1],
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });

  it('Updates input on typing', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        value={category}
        setValue={setCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = (await screen.findByPlaceholderText(
      'Account Type'
    )) as HTMLInputElement;

    await userEvent.type(dropdown, 'Fake Account Type');

    const newAccountTypeElement = await screen.findByText('Fake Account Type');

    expect(newAccountTypeElement).toBeVisible();
  });

  it('Assigns an account type with a new label', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        value={category}
        setValue={setCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByPlaceholderText('Account Type');

    await userEvent.type(dropdown, 'My New Account type');

    const newAccount = await screen.findByText('My New Account type');

    await userEvent.click(newAccount);

    expect(setCategoryMock).toHaveBeenCalledWith({
      name: 'My New Account type',
      id: -1,
      group_name: 'Create New Account Type',
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });

  it('Matches "new" cateogry with existing one', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        value={category}
        setValue={setCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByPlaceholderText('Account Type');

    await userEvent.type(dropdown, 'Credit Card');

    const newAccount = await screen.findByText('Credit Card');
    await userEvent.click(newAccount);

    expect(dropdown).toHaveValue('Credit Card');

    expect(setCategoryMock).toHaveBeenCalledWith({
      name: 'Credit Card',
      id: 2,
      group_name: 'Group 2',
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });
});
