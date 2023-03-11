import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Account from '../../features/Accounts/types/types';
import Transaction from '../../features/Transactions/types/types';
import { RootState, setupStore } from '../../stores/store';

import { mockThunkReturn, renderWithProviders } from '../setupTests';
import { CategorizeTxnForm } from '../../features/CategorizeTransactions';
import * as AccountThunks from '../../features/Accounts/stores/accountThunks';
import * as TransactionThunks from '../../features/Transactions/stores/transactionThunks';

describe('Categorize Transaction Form', () => {
  let testStore: RootState;

  const selectTransaction = jest.fn();
  const unSelectTransaction = jest.fn();

  const activeAccount: Account = {
    id: 1,
    name: 'Fake Active Account',
    account_type_id: 1,
    account_type: 'Test',
    debit_inc: false,
    balance: 0.0,
    last_updated: '03/03/2023',
  };

  const otherAccount: Account = {
    id: 2,
    name: 'Fake Other Account',
    account_type_id: 1,
    account_type: 'Test',
    debit_inc: true,
    balance: 10.0,
    last_updated: '03/03/2023',
  };

  const transactionData: Transaction = {
    id: 1,
    name: 'Transaction 1',
    description: "Transaction 1's very important desription.",
    amount: -20.23,
    debit_account_id: 1,
    credit_account_id: 'undefined',
    transaction_date: '2023-03-03',
    date_entered: '2023-03-03',
  };

  beforeEach(() => {
    testStore = setupStore({
      pageSlice: {
        categorizationPage: {
          activeAccount,
        },
      },
      accounts: {
        accounts: [activeAccount, otherAccount],
      },
      transactions: {
        transactionList: { 1: transactionData },
        isTransactionsLoaded: true,
      },
    });
  });
  it('Renders without error', async () => {
    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const transactioNames = await screen.findAllByText('Transaction 1');
    // Name for form and its toggled details
    expect(transactioNames).toHaveLength(2);
    expect(transactioNames[0]).toBeVisible();

    const transactionDate = await screen.findByText('03/03/2023');
    expect(transactionDate).toBeVisible();

    const transactionDescription = await screen.findByText(
      "Transaction 1's very important d..."
    );
    expect(transactionDescription).toBeVisible();

    const transactionAmount = await screen.findByText('$-20.23');
    expect(transactionAmount).toBeVisible();

    const addTransactionButton = await screen.findByText('Add');
    expect(addTransactionButton).toBeVisible();
  });

  it('Checkbox calls state update', async () => {
    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const checkBox = (await screen.findByRole('checkbox')) as HTMLInputElement;
    expect(checkBox.value).toEqual('0');

    act(() => {
      userEvent.click(checkBox);
    });

    expect(checkBox.value).toEqual('1');
    expect(selectTransaction).toHaveBeenCalledWith(transactionData);

    act(() => {
      userEvent.click(checkBox);
    });

    expect(checkBox.value).toEqual('0');
    expect(unSelectTransaction).toHaveBeenCalledWith(transactionData);
  });

  it('Transaction Description truncates if too long', async () => {
    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const transactionDescription = await screen.findByText(
      "Transaction 1's very important d..."
    );
    expect(transactionDescription).toBeVisible();
  });

  it('Transaction Name is truncated if too long', async () => {
    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={{
          ...transactionData,
          name: 'This name is going to be far too long to display at once.',
        }}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const transactionDescription = await screen.findByText(
      'This name is goi...'
    );
    expect(transactionDescription).toBeVisible();
  });

  it('Negative transaction amounts are rendered with negative sign', async () => {
    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const transactionAmount = await screen.findByText('$-20.23');
    expect(transactionAmount).toBeVisible();
  });

  it('Add button posts categorize transaction', async () => {
    const addTransactionCategory = jest.spyOn(
      TransactionThunks,
      'addTransactionCategory'
    );
    addTransactionCategory.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const addButton = await screen.findByText('Add');

    userEvent.click(addButton);

    expect(addTransactionCategory).toHaveBeenCalledWith(
      activeAccount,
      transactionData.id,
      2,
      'credit'
    );
  });

  it('Add button posts with new account categorizes transaction', async () => {
    const addNewAccount = jest.spyOn(AccountThunks, 'addNewAccount');
    addNewAccount.mockReturnValue(mockThunkReturn);

    const addTransactionCategory = jest.spyOn(
      TransactionThunks,
      'addTransactionCategory'
    );
    addTransactionCategory.mockReturnValue(mockThunkReturn);

    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const addButton = await screen.findByText('Add');

    const accountDropdown = (await screen.findByRole(
      'combobox'
    )) as HTMLInputElement;

    act(() => {
      userEvent.type(accountDropdown, 'New Account');
    });

    const newAccountSelection = await screen.findByText(
      'Create new category: New Account'
    );

    fireEvent.click(newAccountSelection);

    userEvent.click(addButton);

    expect(addTransactionCategory).toHaveBeenCalledWith(
      activeAccount,
      transactionData.id,
      -1,
      'credit'
    );

    expect(addNewAccount).toHaveBeenCalledWith(
      'New Account',
      { label: 'New Account', value: -1 },
      true
    );
  });

  it('Clicking toggles greater description detail visibility', async () => {
    const { container } = renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        isSelected={0}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
      />,
      {
        store: testStore,
      }
    );

    const transactionDetailsContainer = container.querySelector(
      '.transaction-details'
    );

    expect(transactionDetailsContainer).toHaveClass('hide');

    const transactionDescription = await screen.findByText(
      "Transaction 1's very important d..."
    );

    userEvent.click(transactionDescription);

    expect(transactionDetailsContainer).not.toHaveClass('hide');

    userEvent.click(transactionDescription);

    expect(transactionDetailsContainer).toHaveClass('hide');
  });
});
