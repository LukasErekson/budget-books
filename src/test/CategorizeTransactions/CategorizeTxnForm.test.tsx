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
import { fakeAccounts, otherAccount } from '../Accounts/mockAccounts';
import ReactModal from 'react-modal';

ReactModal.setAppElement('body');

describe('Categorize Transaction Form', () => {
  let testStore: RootState;

  const selectTransaction = jest.fn();
  const unSelectTransaction = jest.fn();

  const activeAccount: Account = fakeAccounts[0];

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
      accountTypes: {
        accountTypes: [
          {
            name: activeAccount.account_type,
            id: activeAccount.account_type_id,
            group: 'Test',
          },
        ],
      },
      transactions: {
        transactionList: { 1: transactionData },
        isTransactionsLoaded: true,
        selectedTransactions: [],
      },
    });

    jest.resetAllMocks();
  });
  it('Renders without error', async () => {
    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
        listIndex={0}
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
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
        listIndex={0}
      />,
      {
        store: testStore,
      }
    );

    const checkBox = (await screen.findByRole('checkbox')) as HTMLInputElement;
    expect(checkBox.value).toEqual('on');

    await userEvent.click(checkBox);

    expect(checkBox.value).toEqual('on');
    expect(selectTransaction).toHaveBeenCalledWith(
      transactionData,
      0,
      false,
      []
    );

    await userEvent.click(checkBox);

    expect(checkBox.value).toEqual('on');
  });

  it('Transaction Description truncates if too long', async () => {
    renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
        listIndex={0}
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
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
        listIndex={0}
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
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
        listIndex={0}
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
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
        listIndex={0}
      />,
      {
        store: testStore,
      }
    );

    const addButton = await screen.findByText('Add');

    await userEvent.click(addButton);

    expect(addTransactionCategory).toHaveBeenCalledWith(
      activeAccount,
      transactionData.id,
      2,
      'credit'
    );
  });

  it('Clicking toggles greater description detail visibility', async () => {
    const { container } = renderWithProviders(
      <CategorizeTxnForm
        transacitonData={transactionData}
        debitInc={true}
        account={activeAccount}
        selectTransaction={selectTransaction}
        unSelectTransaction={unSelectTransaction}
        listIndex={0}
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

    await userEvent.click(transactionDescription);

    expect(transactionDetailsContainer).not.toHaveClass('hide');

    await userEvent.click(transactionDescription);

    expect(transactionDetailsContainer).toHaveClass('hide');
  });

  describe('When inputing a new account into the category field', () => {
    it('Add button opens New Account Modal', async () => {
      renderWithProviders(
        <CategorizeTxnForm
          transacitonData={transactionData}
          debitInc={true}
          account={activeAccount}
          selectTransaction={selectTransaction}
          unSelectTransaction={unSelectTransaction}
          listIndex={0}
        />,
        {
          store: testStore,
        }
      );

      const addButton = await screen.findByText('Add');

      const accountDropdown = (await screen.findByPlaceholderText(
        'Account'
      )) as HTMLInputElement;

      await userEvent.type(accountDropdown, 'New Account');

      const newAccountSelection = await screen.findByText('New Account');

      await userEvent.click(newAccountSelection);

      await userEvent.click(addButton);

      const newAccountModalTitle = await screen.findByText('Add New Account');

      expect(newAccountModalTitle).toBeVisible();
    });

    it('Saving new account posts new account and sets it to the transaction category', async () => {
      const addNewAccount = jest.spyOn(AccountThunks, 'addNewAccount');
      addNewAccount.mockReturnValue(mockThunkReturn);

      const newTransaction = jest.spyOn(
        TransactionThunks,
        'addTransactionCategory'
      );
      newTransaction.mockReturnValue(mockThunkReturn);

      renderWithProviders(
        <CategorizeTxnForm
          transacitonData={transactionData}
          debitInc={true}
          account={activeAccount}
          selectTransaction={selectTransaction}
          unSelectTransaction={unSelectTransaction}
          listIndex={0}
        />,
        {
          store: testStore,
        }
      );

      const addButton = await screen.findByText('Add');

      const accountDropdown = (await screen.findByPlaceholderText(
        'Account'
      )) as HTMLInputElement;

      await userEvent.type(accountDropdown, 'New Account');

      const newAccountSelection = await screen.findByText('New Account');

      await userEvent.click(newAccountSelection);

      await userEvent.click(addButton);

      const newAccountModalTitle = await screen.findByText('Add New Account');

      expect(newAccountModalTitle).toBeVisible();

      const AccountTypeDropdown = await screen.findByPlaceholderText(
        'Account Type'
      );

      await userEvent.click(AccountTypeDropdown);
      await userEvent.click(await screen.findByText('Checking Account'));

      await userEvent.click(await screen.findByText('Add Account'));

      expect(addNewAccount).toHaveBeenCalled();

      await userEvent.click(addButton);

      expect(newTransaction).toHaveBeenCalledWith(
        expect.anything(),
        transactionData.debit_account_id,
        3, // New Account ID is 1 more than the number of accounts in state or the new account's ID
        'credit'
      );
    });
  });
});
