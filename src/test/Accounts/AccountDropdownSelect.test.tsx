import React from 'react';
import { act, screen, waitForElementToBeRemoved } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { fakeAccounts } from './mockAccounts';
import { AccountDropdownSelect } from '../../features/Accounts';

import { RootState, setupStore } from '../../stores/store';
import { renderWithProviders } from '../setupTests';
import AccountType from '../../features/AccountTypes/types/types';
import userEvent from '@testing-library/user-event';

describe('AccountDropdownSelect Component', () => {
  let testStore: RootState;
  let fakeAccountTypes: AccountType[];
  let testAccounts: Account[];

  let mockValue: Account = {} as Account;
  const setMockValue = jest.fn((newValue: Account) => {
    mockValue = newValue;
  });
  let mockInput: string = '';
  const setMockInput = jest.fn((newValue: string) => {
    mockInput = newValue;
  });

  beforeAll(() => {
    testAccounts = JSON.parse(JSON.stringify(fakeAccounts));

    fakeAccountTypes = fakeAccounts.map((account: Account) => {
      return {
        id: account.account_type_id,
        group_name: account.account_group,
        name: account.account_type,
      };
    });
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
      <AccountDropdownSelect
        value={mockValue}
        setValue={setMockValue}
        inputValue={mockInput}
        setInputValue={setMockInput}
        excludeAccount={testAccounts[2]}
      />,
      { store: testStore }
    );

    expect(await screen.findByPlaceholderText('Account')).toBeDefined();
  });

  it('Displays all options on click', async () => {
    renderWithProviders(
      <AccountDropdownSelect
        value={mockValue}
        setValue={setMockValue}
        inputValue={mockInput}
        setInputValue={setMockInput}
        excludeAccount={testAccounts[1]}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByPlaceholderText('Account');

    userEvent.click(dropdown);

    expect(await screen.findByText('Fake Account 1')).toBeVisible();
    expect(await screen.findByText('Fake Account 3')).toBeVisible();
    expect(await screen.findByText('Group 1')).toBeVisible();
  });

  it('Updates input on typing', async () => {
    renderWithProviders(
      <AccountDropdownSelect
        value={mockValue}
        setValue={setMockValue}
        inputValue={mockInput}
        setInputValue={setMockInput}
        excludeAccount={testAccounts[2]}
      />,
      { store: testStore }
    );

    const dropdown = (await screen.findByPlaceholderText(
      'Account'
    )) as HTMLInputElement;

    await userEvent.type(dropdown, 'Fake Account');

    expect(setMockInput).toHaveBeenCalled();

    expect(await screen.findByText('Fake Account 1')).toBeVisible();
  });

  it('Matches "new" category with existing one', async () => {
    renderWithProviders(
      <AccountDropdownSelect
        value={mockValue}
        setValue={setMockValue}
        inputValue={mockInput}
        setInputValue={setMockInput}
        excludeAccount={testAccounts[2]}
      />,
      { store: testStore }
    );

    const dropdown = (await screen.findByPlaceholderText(
      'Account'
    )) as HTMLInputElement;

    await userEvent.type(dropdown, 'Fake Account', { delay: 2 });

    const newAccount = await screen.findByText('Fake Account 1');

    await userEvent.click(newAccount);

    expect(setMockInput).toHaveBeenCalledWith(
      expect.stringMatching('Fake Account')
    );

    expect(setMockValue).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Fake Account 1' })
    );
  });
});
