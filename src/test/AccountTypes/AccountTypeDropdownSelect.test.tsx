import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { AccountTypeDropdownSelect } from '../../features/AccountTypes';

import { RootState, setupStore } from '../../stores/store';
import { renderWithProviders } from '../setupTests';
import AccountType from '../../features/AccountTypes/types/types';
import * as AccountTypeSelectors from '../../features/AccountTypes/stores/accountTypeSelectors';
import { fakeAccounts } from '../Accounts/mockAccounts';

describe('AccountDropdownSelect Component', () => {
  let testStore: RootState;
  let fakeAccountTypes: AccountType[];
  let testAccounts: Account[];

  let category: { label: string; value: number } = {
    label: 'New Account',
    value: -1,
  };
  const setCategoryMock: jest.Mock<any, any, any> = jest.fn(
    (newValue: { label: string; value: number }) => {
      category = newValue;
    }
  );
  let input: string = category.label;
  const setInputCategoryMock: jest.Mock<any, any, any> = jest.fn(
    (newValue: string) => {
      input = newValue;
    }
  );

  beforeAll(() => {
    testAccounts = JSON.parse(JSON.stringify(fakeAccounts));

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
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    expect(await screen.findByText('New Account')).toBeDefined();
  });

  it('Displays all options on click', async () => {
    const selectMock = jest.spyOn(
      AccountTypeSelectors,
      'selectAccountTypeByGroups'
    );

    renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    expect(selectMock).toHaveBeenCalled();

    fireEvent.input(dropdown, { target: { value: ' ' } });

    expect(await screen.findByText('Checking Account')).toBeVisible();
    expect(await screen.findByText('Credit Card')).toBeVisible();
    expect(await screen.findByText('Assets')).toBeVisible();
    expect(await screen.findByText('Liabilities')).toBeVisible();
  });

  it('Updates account type on click', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.input(dropdown, { target: { value: ' ' } });

    const accountType = await screen.findByText(fakeAccountTypes[0].name);

    fireEvent.click(accountType);

    expect(setCategoryMock).toHaveBeenCalledWith({
      label: fakeAccountTypes[0].name,
      value: 1,
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });

  it('Updates input on typing', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.input(dropdown, { target: { value: 'Fake Account Type' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('Fake Account Type');
  });

  it('Assigns an account type with a new label', async () => {
    const { rerender } = renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.click(dropdown);
    fireEvent.input(dropdown, { target: { value: 'My New Account type' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('My New Account type');

    rerender(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={'My New Account type'}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />
    );

    const newAccount = await screen.findByText(
      'Create new category: My New Account type'
    );

    fireEvent.click(newAccount);

    expect(setCategoryMock).toHaveBeenCalledWith({
      label: 'My New Account type',
      value: -1,
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });

  it('Matches "new" cateogry with existing one', async () => {
    const { rerender } = renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.click(dropdown);
    fireEvent.input(dropdown, { target: { value: 'Checking Account' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('Checking Account');

    rerender(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={'Checking Account'}
        setInputCategory={setInputCategoryMock}
        id={'testAccountType'}
      />
    );

    const newAccount = await screen.findByText(
      'Create new category: Checking Account'
    );

    fireEvent.click(newAccount);

    expect(setCategoryMock).toHaveBeenCalledWith({
      label: 'Checking Account',
      value: 1,
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });
});
