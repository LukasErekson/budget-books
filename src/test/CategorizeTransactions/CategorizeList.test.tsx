import React from 'react';

import { RootState, setupStore } from '../../stores/store';
import Account from '../../features/Accounts/types/types';
import Transaction from '../../features/Transactions/types/types';

import { CategorizeList } from '../../features/CategorizeTransactions';
import { renderWithProviders } from '../setupTests';
import { screen, act } from '@testing-library/react';
import { setTransactionsIsLoaded } from '../../features/Transactions/stores/transactionSlice';
import userEvent from '@testing-library/user-event';

describe('Categorize List Component', () => {
  let testStore: RootState;

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

  const transactionData: Transaction[] = [
    {
      id: 1,
      name: 'Transaction 1',
      description: "Transaction 1's very important desription.",
      amount: -20.23,
      debit_account_id: 1,
      credit_account_id: 'undefined',
      transaction_date: '2023-03-03',
      date_entered: '2023-03-03',
    },
    {
      id: 2,
      name: 'Transaction 2',
      description: "Transaction 2's very important desription.",
      amount: -25.23,
      debit_account_id: 1,
      credit_account_id: 'undefined',
      transaction_date: '2023-03-02',
      date_entered: '2023-03-02',
    },
  ];

  const setShowAddNewTxn = jest.fn();
  const setSelectedTransactions = jest.fn();
  const addSelectedTransaction = jest.fn();
  const removeSelectedTransaction = jest.fn();

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
        isTransactionsLoaded: false,
      },
    });
    renderWithProviders(
      <CategorizeList
        account={activeAccount}
        selectedTransactions={[]}
        setShowAddNewTxn={setShowAddNewTxn}
        setSelectedTransactions={setSelectedTransactions}
        addSelectedTransaction={addSelectedTransaction}
        removeSelectedTransaction={removeSelectedTransaction}
      />,
      {
        store: testStore,
      }
    );

    const loadingText = await screen.findByText('Loading...');
    expect(loadingText).toBeVisible();

    act(() => {
      testStore.dispatch(setTransactionsIsLoaded({ loaded: true }));
    });

    expect(loadingText).not.toBeVisible();

    // Transactions display
    const transactionForm1 = await screen.findAllByText('Transaction 1');
    expect(transactionForm1).toBeDefined();

    const transactionForm2 = await screen.findAllByText('Transaction 2');
    expect(transactionForm2).toBeDefined();
  });
  // Loading screen displays, check for headers and rendered transaction(s)

  describe('Sorting', () => {
    it('Sorting by date works', async () => {
      const { rerender } = renderWithProviders(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />,
        {
          store: testStore,
        }
      );

      const dateHeader = await screen.findByText('Date');
      expect(dateHeader).toBeDefined();

      let transactionDates = await screen.findAllByText(/03\/0\d\/2023/);

      transactionDates = transactionDates.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      let dateOrder = transactionDates.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(dateOrder).toEqual(['03/02/2023', '03/03/2023']);

      // Ascending to Descending
      await act(async () => {
        await userEvent.click(dateHeader);
      });

      rerender(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />
      );

      transactionDates = await screen.findAllByText(/03\/0\d\/2023/);

      transactionDates = transactionDates.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      dateOrder = transactionDates.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(dateOrder).toEqual(['03/03/2023', '03/02/2023']);
    });

    it('Sorting by name works', async () => {
      const { rerender } = renderWithProviders(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />,
        {
          store: testStore,
        }
      );

      const nameHeader = await screen.findByText('Name');
      expect(nameHeader).toBeDefined();

      // Ascending by name
      await act(async () => {
        await userEvent.click(nameHeader);
      });

      let transactionNames = await screen.findAllByText(/Transaction \d$/);

      transactionNames = transactionNames.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      let nameOrder = transactionNames.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(nameOrder).toEqual(['Transaction 1', 'Transaction 2']);

      // Descending by name
      await act(async () => {
        await userEvent.click(nameHeader);
      });

      rerender(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />
      );

      transactionNames = await screen.findAllByText(/Transaction \d$/);

      transactionNames = transactionNames.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      nameOrder = transactionNames.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(nameOrder).toEqual(['Transaction 2', 'Transaction 1']);
    });

    it('Sorting by description works', async () => {
      const { rerender } = renderWithProviders(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />,
        {
          store: testStore,
        }
      );

      const descriptionHeader = await screen.findByText('Description');
      expect(descriptionHeader).toBeDefined();

      // Ascending by description
      await act(async () => {
        await userEvent.click(descriptionHeader);
      });

      let descriptionNames = await screen.findAllByText(/Transaction \d's .*/);

      descriptionNames = descriptionNames.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      let descriptionOrder = descriptionNames.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(descriptionOrder).toEqual([
        "Transaction 1's very important d...",
        "Transaction 2's very important d...",
      ]);

      // Descending by description
      await act(async () => {
        await userEvent.click(descriptionHeader);
      });

      rerender(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />
      );

      descriptionNames = await screen.findAllByText(/Transaction \d's .*/);

      descriptionNames = descriptionNames.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      descriptionOrder = descriptionNames.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(descriptionOrder).toEqual([
        "Transaction 2's very important d...",
        "Transaction 1's very important d...",
      ]);
    });

    it('Sorting by amount works', async () => {
      const { rerender } = renderWithProviders(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />,
        {
          store: testStore,
        }
      );

      const amountHeader = await screen.findByText('Amount');
      expect(amountHeader).toBeDefined();

      // Ascending by amount
      await act(async () => {
        await userEvent.click(amountHeader);
      });

      let amountValues = await screen.findAllByText(/\$-\d{2}.\d{2}/);

      amountValues = amountValues.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      let amountOrder = amountValues.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(amountOrder).toEqual(['$-25.23', '$-20.23']);

      // Descending by amount
      await act(async () => {
        await userEvent.click(amountHeader);
      });

      rerender(
        <CategorizeList
          account={activeAccount}
          selectedTransactions={[]}
          setShowAddNewTxn={setShowAddNewTxn}
          setSelectedTransactions={setSelectedTransactions}
          addSelectedTransaction={addSelectedTransaction}
          removeSelectedTransaction={removeSelectedTransaction}
        />
      );

      amountValues = await screen.findAllByText(/\$-\d{2}.\d{2}/);

      amountValues = amountValues.filter((element: HTMLElement) =>
        element.classList.contains('categorize-txn-item')
      );

      amountOrder = amountValues.map(
        (remainingElements: HTMLElement) => remainingElements.textContent
      );

      expect(amountOrder).toEqual(['$-20.23', '$-25.23']);
    });
  });
});
