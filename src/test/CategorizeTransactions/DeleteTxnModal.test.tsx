import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Account from '../../features/Accounts/types/types';
import Transaction from '../../features/Transactions/types/types';

import { DeleteTxnModal } from '../../features/CategorizeTransactions';
import { RootState, setupStore } from '../../stores/store';
import { fakePromise, renderWithProviders } from '../setupTests';

import * as TransactionThunks from '../../features/Transactions/stores/transactionThunks';

import ReactModal from 'react-modal';
import { fakeAccounts, otherAccount } from '../Accounts/mockAccounts';
ReactModal.setAppElement('body');

describe('Delete Transaction Modal', () => {
  let testStore: RootState;

  const onRequestClose = jest.fn();

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
      transactions: {
        transactionList: { 1: transactionData },
        isTransactionsLoaded: true,
      },
    });
  });
  it('Renders without error', async () => {
    renderWithProviders(
      <div id='root'>
        <DeleteTxnModal
          isOpen={true}
          onRequestClose={onRequestClose}
          transactionData={transactionData}
          amountIsNegative={true}
        />
      </div>
    );

    const header = await screen.findByText('Delete Transaction?');

    expect(header).toBeVisible();

    const warning = await screen.findByText('There is no undoing this action.');

    expect(warning).toBeVisible();

    const yesButton = await screen.findByText('Yes');
    const noButton = await screen.findByText('No');

    expect(yesButton.tagName).toEqual('BUTTON');

    expect(noButton.tagName).toEqual('BUTTON');
  });

  it('Displays the transaction name, date, and amount', async () => {
    renderWithProviders(
      <div id='root'>
        <DeleteTxnModal
          isOpen={true}
          onRequestClose={onRequestClose}
          transactionData={transactionData}
          amountIsNegative={true}
        />
      </div>
    );

    const transactionName = await screen.findByText('Transaction 1');
    const transactionDate = await screen.findByText('03/03/2023');
    const transactionAmount = await screen.findByText('$-20.23');

    expect(transactionName).toBeVisible();
    expect(transactionDate).toBeVisible();
    expect(transactionAmount).toBeVisible();
  });

  it('Dispatches a delete and closes modal on clicking yes', async () => {
    const deleteTransaction = jest.spyOn(
      TransactionThunks,
      'deleteTransactions'
    );
    deleteTransaction.mockReturnValue(() => fakePromise);

    renderWithProviders(
      <div id='root'>
        <DeleteTxnModal
          isOpen={true}
          onRequestClose={onRequestClose}
          transactionData={transactionData}
          amountIsNegative={true}
        />
      </div>
    );

    const yesButton = await screen.findByText('Yes');

    await act(async () => {
      await userEvent.click(yesButton);
    });

    expect(deleteTransaction).toHaveBeenCalledWith([transactionData]);
  });

  it('Closes the modal on clicking no', async () => {
    renderWithProviders(
      <div id='root'>
        <DeleteTxnModal
          isOpen={true}
          onRequestClose={onRequestClose}
          transactionData={transactionData}
          amountIsNegative={true}
        />
      </div>
    );

    const noButton = await screen.findByText('No');

    await act(async () => {
      await userEvent.click(noButton);
    });

    expect(onRequestClose).toBeCalled();
  });
});
