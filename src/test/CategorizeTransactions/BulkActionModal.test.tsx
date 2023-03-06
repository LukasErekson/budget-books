import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockThunkReturn, renderWithProviders } from '../setupTests';

import Transaction from '../../features/Transactions/types/types';
import Account from '../../features/Accounts/types/types';
import { RootState } from '../../stores/store';

import { BulkActionModal } from '../../features/CategorizeTransactions';

import * as AccountThunks from '../../features/Accounts/stores/accountThunks';
import * as CategorizeThunks from '../../features/Transactions/stores/transactionThunks';

import ReactModal from 'react-modal';

ReactModal.setAppElement('body');

describe('Bulk Action Modal', () => {
  let testState: RootState;

  const activeAccount: Account = {
    id: 1,
    name: 'Fake Active Account',
    account_type_id: 1,
    account_type: 'Test',
    debit_inc: false,
    balance: 0.0,
    last_updated: '03/03/2023',
  };
  const onRequestClose = jest.fn();
  const selectedTransactions: Transaction[] = [
    {
      id: 1,
      name: 'Transaction 1',
      description: "Transaction 1's very important desription.",
      amount: -20.23,
      debit_account_id: 1,
      credit_account_id: 'undefined',
      transaction_date: '03/03/2023',
      date_entered: '03/03/2023',
    },
    {
      id: 2,
      name: 'Transaction 2',
      description: "Transaction 2's very important desription.",
      amount: -25.23,
      debit_account_id: 1,
      credit_account_id: 'undefined',
      transaction_date: '03/03/2023',
      date_entered: '03/03/2023',
    },
  ];
  const removeSelectedTransactions = jest.fn();

  beforeAll(() => {
    testState = {
      pageSlice: {
        categorizationPage: {
          activeAccount,
        },
      },
      accounts: {
        accounts: [activeAccount],
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Renders without error', async () => {
    renderWithProviders(
      <div id='root'>
        <BulkActionModal
          isOpen={true}
          onRequestClose={onRequestClose}
          selectedTransactions={selectedTransactions}
          removeSelectedTransactions={removeSelectedTransactions}
        />
      </div>,
      { preloadedState: testState }
    );

    const header = await screen.findByText('Bulk Actions');
    expect(header).toBeVisible();

    const bulkMessage = await screen.findByText(
      /The following will apply the action to/
    );
    expect(bulkMessage).toBeVisible();

    const transactionsPlural = await screen.findByText(
      /selected transactions for/
    );
    expect(transactionsPlural).toBeVisible();

    const deleteWarning = await screen.findByText(
      /There is no undoing this action./
    );
    expect(deleteWarning).toBeVisible();
  });

  it('Says "transaction" if only one transaction is selected', async () => {
    renderWithProviders(
      <div id='root'>
        <BulkActionModal
          isOpen={true}
          onRequestClose={onRequestClose}
          selectedTransactions={[selectedTransactions[0]]}
          removeSelectedTransactions={removeSelectedTransactions}
        />
      </div>,
      { preloadedState: testState }
    );

    const transactionsPlural = await screen.findByText(
      /selected transaction for/
    );
    expect(transactionsPlural).toBeVisible();
  });

  describe('Categorizing multiple transactions', () => {
    const addNewAccount = jest.spyOn(AccountThunks, 'addNewAccount');
    const addManyTransactionCategories = jest.spyOn(
      CategorizeThunks,
      'addManyTransactionCategories'
    );

    beforeEach(() => {
      // Prevent fetch requests from being dispatched
      addNewAccount.mockReturnValue(mockThunkReturn);
      addManyTransactionCategories.mockReturnValue(mockThunkReturn);
    });

    it('Dispatches categorization for multiple transactions', async () => {
      renderWithProviders(
        <div id='root'>
          <BulkActionModal
            isOpen={true}
            onRequestClose={onRequestClose}
            selectedTransactions={[selectedTransactions[0]]}
            removeSelectedTransactions={removeSelectedTransactions}
          />
        </div>,
        { preloadedState: testState }
      );

      const categorizeButton = await screen.findByText('Categorize');

      expect(categorizeButton).toBeVisible();

      userEvent.click(categorizeButton);

      expect(addNewAccount).toHaveBeenCalledWith(
        'New Account',
        { label: 'New Account', value: -1 },
        true
      );

      expect(addManyTransactionCategories).toHaveBeenCalledWith(
        activeAccount,
        [selectedTransactions[0]],
        -1
      );
    });

    it('Removes the selected transactions from props', async () => {
      renderWithProviders(
        <div id='root'>
          <BulkActionModal
            isOpen={true}
            onRequestClose={onRequestClose}
            selectedTransactions={[selectedTransactions[0]]}
            removeSelectedTransactions={removeSelectedTransactions}
          />
        </div>,
        { preloadedState: testState }
      );

      const categorizeButton = await screen.findByText('Categorize');

      expect(categorizeButton).toBeVisible();

      userEvent.click(categorizeButton);

      expect(removeSelectedTransactions).toHaveBeenCalledWith(
        selectedTransactions[0]
      );
    });

    it('Closes the modal on submit', async () => {
      renderWithProviders(
        <div id='root'>
          <BulkActionModal
            isOpen={true}
            onRequestClose={onRequestClose}
            selectedTransactions={[selectedTransactions[0]]}
            removeSelectedTransactions={removeSelectedTransactions}
          />
        </div>,
        { preloadedState: testState }
      );

      const categorizeButton = await screen.findByText('Categorize');

      expect(categorizeButton).toBeVisible();

      userEvent.click(categorizeButton);

      expect(onRequestClose).toHaveBeenCalled();
    });
  });

  describe('Deleting multiple transactions', () => {
    const deleteTransactions = jest.spyOn(
      CategorizeThunks,
      'deleteTransactions'
    );

    beforeEach(() => {
      // Prevent fetch requests from being dispatched
      deleteTransactions.mockReturnValue(mockThunkReturn);
    });

    it('Dispatches delete for multiple transactions', async () => {
      renderWithProviders(
        <div id='root'>
          <BulkActionModal
            isOpen={true}
            onRequestClose={onRequestClose}
            selectedTransactions={[selectedTransactions[0]]}
            removeSelectedTransactions={removeSelectedTransactions}
          />
        </div>,
        { preloadedState: testState }
      );

      const deleteButton = await screen.findByText('Delete All');

      expect(deleteButton).toBeVisible();

      userEvent.click(deleteButton);

      expect(deleteTransactions).toHaveBeenCalledWith([
        selectedTransactions[0],
      ]);
    });

    it('Removes the selected transactions from props', async () => {
      renderWithProviders(
        <div id='root'>
          <BulkActionModal
            isOpen={true}
            onRequestClose={onRequestClose}
            selectedTransactions={[selectedTransactions[0]]}
            removeSelectedTransactions={removeSelectedTransactions}
          />
        </div>,
        { preloadedState: testState }
      );

      const deleteButton = await screen.findByText('Delete All');

      expect(deleteButton).toBeVisible();

      userEvent.click(deleteButton);

      expect(removeSelectedTransactions).toHaveBeenCalledWith(
        selectedTransactions[0]
      );
    });

    it('Closes the modal on submit', async () => {
      renderWithProviders(
        <div id='root'>
          <BulkActionModal
            isOpen={true}
            onRequestClose={onRequestClose}
            selectedTransactions={[selectedTransactions[0]]}
            removeSelectedTransactions={removeSelectedTransactions}
          />
        </div>,
        { preloadedState: testState }
      );

      const deleteButton = await screen.findByText('Delete All');

      expect(deleteButton).toBeVisible();

      userEvent.click(deleteButton);

      expect(onRequestClose).toHaveBeenCalled();
    });
  });
});
