import React from 'react';

import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Account from '../../features/Accounts/types/types';
import AccountType from '../../features/AccountTypes/types/types';
import * as TransactionThunks from '../../features/Transactions/stores/transactionThunks';

import { mockThunkReturn, renderWithProviders } from '../setupTests';
import { RootState, setupStore } from '../../stores/store';

import { AddTxnForm } from '../../features/CategorizeTransactions';
import { yearMonthDay } from '../../utils/TextFilters';
import dayjs from 'dayjs';
import { fakeAccounts } from '../Accounts/mockAccounts';

describe('Add Transaction Form', () => {
  let testStore: RootState;
  let testAccounts: Account[];

  const setShowMock: jest.Mock<any, any, any> = jest.fn(
    (show: boolean) => show
  );

  beforeAll(() => {
    testAccounts = JSON.parse(JSON.stringify(fakeAccounts));
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
      <AddTxnForm
        debitInc={true}
        account={testAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );
  });

  it('Form elements are present', async () => {
    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={testAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const dateInput = screen.getByPlaceholderText(
      'MM/DD/YYYY'
    ) as HTMLInputElement;

    expect(dateInput).toBeDefined();
    expect(dateInput.value).toEqual(dayjs().format('MM/DD/YYYY'));

    const transactionName = screen.getByPlaceholderText('Transaction Name');

    expect(transactionName).toBeDefined();

    const transactionDescription = screen.getByPlaceholderText(
      'Transaction Description'
    );
    expect(transactionDescription).toBeDefined();

    const transactionAmount = screen.getAllByRole(
      'textbox'
    )[3] as HTMLInputElement;

    expect(transactionAmount).toBeDefined();
  });

  it('Posting to a blank form does nothing', async () => {
    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={testAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const postButton = screen.getAllByRole('button')[1];

    await userEvent.click(postButton);

    expect(setShowMock).not.toHaveBeenCalled();
  });

  it('Posts the transaction information on click', async () => {
    const addTransactionThunk = jest.spyOn(TransactionThunks, 'addTransaction');
    addTransactionThunk.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={testAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const transactionName = screen.getByPlaceholderText('Transaction Name');

    const transactionDescription = screen.getByPlaceholderText(
      'Transaction Description'
    );

    const transactionAmount = screen.getAllByRole(
      'textbox'
    )[3] as HTMLInputElement;

    await userEvent.type(transactionName, 'Fake Transaction');
    await userEvent.type(
      transactionDescription,
      'This is an example of the add transaction form.'
    );
    await userEvent.type(transactionAmount, '-20.25');

    const postButton = (await screen.findAllByRole('button'))[1];

    await userEvent.click(postButton);

    expect(addTransactionThunk).toHaveBeenCalledWith(testAccounts[0], {
      amount: '20.25',
      credit_account_id: 1,
      debit_account_id: undefined,
      description: 'This is an example of the add transaction form.',
      name: 'Fake Transaction',
      transaction_date: yearMonthDay(new Date()),
    });
  });

  it('Closes with close button', async () => {
    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={testAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const closeButton = (await screen.findAllByRole('button'))[2];

    expect(closeButton).toBeDefined();

    await userEvent.click(closeButton);

    expect(setShowMock).toHaveBeenCalled();
  });
});
