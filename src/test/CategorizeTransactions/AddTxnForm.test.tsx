import React from 'react';

import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Account from '../../features/Accounts/types/types';
import AccountType from '../../features/AccountTypes/types/types';
import * as TransactionThunks from '../../features/Transactions/stores/transactionThunks';

import { renderWithProviders } from '../setupTests';
import { RootState, setupStore } from '../../stores/store';

import { AddTxnForm } from '../../features/CategorizeTransactions';
import { yearMonthDay } from '../../utils/TextFilters';

describe('Add Transaction Form', () => {
  let testStore: RootState;
  let fakeAccounts: Account[];

  const setShowMock: jest.Mock<any, any, any> = jest.fn(
    (show: boolean) => show
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
    ];

    const fakeAccountTypes: AccountType[] = [
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
      <AddTxnForm
        debitInc={true}
        account={fakeAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );
  });

  it('Form elements are present', async () => {
    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={fakeAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const dateInput = screen.getByTestId('add-txn-date') as HTMLInputElement;

    expect(dateInput).toBeDefined();
    expect(dateInput.value).toEqual(yearMonthDay(new Date()));

    const transactionName = screen.getAllByRole(
      'textbox'
    )[0] as HTMLInputElement;

    expect(transactionName).toBeDefined();
    expect(transactionName.placeholder).toEqual('Transaction Name');

    const transactionDescription = screen.getAllByRole(
      'textbox'
    )[1] as HTMLInputElement;

    expect(transactionDescription).toBeDefined();
    expect(transactionDescription.placeholder).toEqual(
      'Transaction Description'
    );

    const transactionAmount = screen.getAllByRole(
      'textbox'
    )[2] as HTMLInputElement;

    expect(transactionAmount).toBeDefined();
  });

  it('Posting to a blank form does nothing', () => {
    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={fakeAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const postButton = screen.getAllByRole('button')[0];

    userEvent.click(postButton);

    expect(setShowMock).not.toHaveBeenCalled();
  });

  it('Posts the transaction information on click', () => {
    const fakePromise: Promise<any> = new Promise(() => {});
    const addTransactionThunk = jest.spyOn(TransactionThunks, 'addTransaction');
    addTransactionThunk.mockReturnValue(() => fakePromise);

    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={fakeAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const transactionName = screen.getAllByRole(
      'textbox'
    )[0] as HTMLInputElement;

    const transactionDescription = screen.getAllByRole(
      'textbox'
    )[1] as HTMLInputElement;

    const transactionAmount = screen.getAllByRole(
      'textbox'
    )[2] as HTMLInputElement;

    act(() => {
      userEvent.type(transactionName, 'Fake Transaction');
      userEvent.type(
        transactionDescription,
        'This is an example of the add transaction form.'
      );
      userEvent.type(transactionAmount, '-20.25');
    });

    const postButton = screen.getAllByRole('button')[0];
    userEvent.click(postButton);

    expect(addTransactionThunk).toHaveBeenCalledWith(fakeAccounts[0], {
      amount: '20.25',
      credit_account_id: 1,
      debit_account_id: undefined,
      description: 'This is an example of the add transaction form.',
      name: 'Fake Transaction',
      transaction_date: yearMonthDay(new Date()),
    });
  });

  it('Closes with close button', () => {
    renderWithProviders(
      <AddTxnForm
        debitInc={true}
        account={fakeAccounts[0]}
        setShowAddNewTxn={setShowMock}
      />,
      { store: testStore }
    );

    const closeButton = screen.getAllByRole('button')[1];

    expect(closeButton).toBeDefined();

    userEvent.click(closeButton);

    expect(setShowMock).toHaveBeenCalled();
  });
});
