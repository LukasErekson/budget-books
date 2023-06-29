import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { AccountDropdownSelect } from '../../features/Accounts';

import { RootState, setupStore } from '../../stores/store';
import { renderWithProviders } from '../setupTests';
import AccountType from '../../features/AccountTypes/types/types';
import * as AccountSelectors from '../../features/Accounts/stores/accountSelectors';

describe('AccountDropdownSelect Component', () => {
  let testStore: RootState;
  let fakeAccountTypes: AccountType[];
  let fakeAccounts: Account[];

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
    fakeAccounts = [
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
      {
        id: 3,
        name: 'Fake Account 3',
        account_type_id: 2,
        account_type: 'Credit Card',
        debit_inc: false,
        balance: 0.0,
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
    jest.resetAllMocks();
  });

  it('Renders without error', async () => {
    renderWithProviders(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />,
      { store: testStore }
    );

    expect(await screen.findByText('New Account')).toBeDefined();
  });

  it('Displays all options on click', async () => {
    const selectMock = jest.spyOn(AccountSelectors, 'selectAccountOptions');

    renderWithProviders(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    expect(selectMock).toHaveBeenCalled();

    fireEvent.input(dropdown, { target: { value: ' ' } });

    expect(await screen.findByText('Fake Account 1')).toBeVisible();
    expect(await screen.findByText('Fake Account 2')).toBeVisible();
    expect(await screen.findByText('Assets')).toBeVisible();
    expect(await screen.findByText('Liabilities')).toBeVisible();
  });

  it('Updates category on click', async () => {
    renderWithProviders(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.input(dropdown, { target: { value: ' ' } });

    const account = await screen.findByText(fakeAccounts[0].name);

    fireEvent.click(account);

    expect(setCategoryMock).toHaveBeenCalledWith({
      label: 'Fake Account 1',
      value: 1,
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });

  it('Updates input on typing', async () => {
    renderWithProviders(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.input(dropdown, { target: { value: 'Fake Account 1' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('Fake Account 1');
  });

  it('Assigns a category with a new label', async () => {
    const { rerender } = renderWithProviders(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.click(dropdown);
    fireEvent.input(dropdown, { target: { value: 'My New Account' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('My New Account');

    rerender(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={'My New Account'}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />
    );

    const newAccount = await screen.findByText(
      'Create new category: My New Account'
    );

    fireEvent.click(newAccount);

    expect(setCategoryMock).toHaveBeenCalledWith({
      label: 'My New Account',
      value: -1,
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });

  it('Matches "new" cateogry with existing one', async () => {
    const { rerender } = renderWithProviders(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />,
      { store: testStore }
    );

    const dropdown = await screen.findByRole('combobox');

    fireEvent.click(dropdown);
    fireEvent.input(dropdown, { target: { value: 'Fake Account 1' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('Fake Account 1');

    rerender(
      <AccountDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={'Fake Account 1'}
        setInputCategory={setInputCategoryMock}
        excludeAccount={fakeAccounts[2]}
      />
    );

    const newAccount = await screen.findByText(
      'Create new category: Fake Account 1'
    );

    fireEvent.click(newAccount);

    expect(setCategoryMock).toHaveBeenCalledWith({
      label: 'Fake Account 1',
      value: 1,
    });
    expect(setCategoryMock).toHaveBeenCalledTimes(1);
  });
});
