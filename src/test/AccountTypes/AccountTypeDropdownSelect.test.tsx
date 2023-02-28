import { fireEvent, screen } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { AccountTypeDropdownSelect } from '../../features/AccountTypes';

import { RootState, setupStore } from '../../stores/store';
import { renderWithProviders } from '../setupTests';
import AccountType from '../../features/AccountTypes/types/types';
import * as AccountTypeSelectors from '../../features/AccountTypes/stores/accountTypeSelectors';

describe('AccountDropdownSelect Component', () => {
  let testStore: RootState;
  let fakeAccountTypes: AccountType[];
  let fakeAccounts: Account[];

  let category: { label: string; value: number } = {
    label: 'New Account',
    value: -1,
  };
  let setCategoryMock: jest.Mock<any, any, any> = jest.fn(
    (newValue: { label: string; value: number }) => {
      category = newValue;
    }
  );
  let input: string = category.label;
  let setInputCategoryMock: jest.Mock<any, any, any> = jest.fn(
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
    jest.resetAllMocks();
  });

  it('Renders without error', async () => {
    renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        name={'testAccountType'}
      />,
      { store: testStore }
    );

    expect(await screen.findByText('New Account')).toBeDefined();
  });

  it('Displays all options on click', async () => {
    let selectMock = jest.spyOn(
      AccountTypeSelectors,
      'selectAccountTypeByGroups'
    );

    renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        name={'testAccountType'}
      />,
      { store: testStore }
    );

    let dropdown = await screen.findByRole('combobox');

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
        name={'testAccountType'}
      />,
      { store: testStore }
    );

    let dropdown = await screen.findByRole('combobox');

    fireEvent.input(dropdown, { target: { value: ' ' } });

    let accountType = await screen.findByText(fakeAccountTypes[0].name);

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
        name={'testAccountType'}
      />,
      { store: testStore }
    );

    let dropdown = await screen.findByRole('combobox');

    fireEvent.input(dropdown, { target: { value: 'Fake Account Type' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('Fake Account Type');
  });

  it('Assigns an account type with a new label', async () => {
    let { rerender } = renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        name={'testAccountType'}
      />,
      { store: testStore }
    );

    let dropdown = await screen.findByRole('combobox');

    fireEvent.click(dropdown);
    fireEvent.input(dropdown, { target: { value: 'My New Account type' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('My New Account type');

    rerender(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={'My New Account type'}
        setInputCategory={setInputCategoryMock}
        name={'testAccountType'}
      />
    );

    let newAccount = await screen.findByText(
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
    let { rerender } = renderWithProviders(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={input}
        setInputCategory={setInputCategoryMock}
        name={'testAccountType'}
      />,
      { store: testStore }
    );

    let dropdown = await screen.findByRole('combobox');

    fireEvent.click(dropdown);
    fireEvent.input(dropdown, { target: { value: 'Checking Account' } });

    expect(setInputCategoryMock).toHaveBeenCalledWith('Checking Account');

    rerender(
      <AccountTypeDropdownSelect
        category={category}
        setCategory={setCategoryMock}
        inputCategory={'Checking Account'}
        setInputCategory={setInputCategoryMock}
        name={'testAccountType'}
      />
    );

    let newAccount = await screen.findByText(
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
