import React from 'react';

import { EditTransactionModal } from '../../features/Transactions';
import ReactModal from 'react-modal';
import { RootState, setupStore } from '../../stores/store';
import Transaction from '../../features/Transactions/types/types';
import { fakePromise, renderWithProviders } from '../setupTests';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import * as TransactionThunks from '../../features/Transactions/stores/transactionThunks';

ReactModal.setAppElement('body');

describe('Edit Transaction Modal', () => {
  let testStore: RootState;

  const onRequestClose = jest.fn();

  const fakeTransaction: Transaction = {
    id: 1,
    name: 'Transaction 1',
    description: "Transaction 1's very important desription.",
    amount: -20.23,
    debit_account_id: 1,
    credit_account_id: 'undefined',
    transaction_date: '2023-03-03',
    date_entered: '2023-03-03',
  };

  it('Renders without error', async () => {
    renderWithProviders(
      <div className='root'>
        <EditTransactionModal
          isOpen={true}
          onRequestClose={onRequestClose}
          transaction={fakeTransaction}
        />
      </div>
    );

    const header = await screen.findByText('Edit Transaction');
    expect(header).toBeVisible();

    const transactionName = await screen.findByLabelText('Name');
    const transactionDate = await screen.findByLabelText('Transaction Date');
    const transactionAmount = await screen.findByLabelText('Amount');
    const transactionDescription = await screen.findByLabelText('Description');

    expect(transactionName).toBeVisible();
    expect(transactionDate).toBeVisible();
    expect(transactionAmount).toBeVisible();
    expect(transactionDescription).toBeVisible();
  });

  it('Disptaches an edit request on save', async () => {
    const mockEditThunk = jest.spyOn(TransactionThunks, 'editTransaction');
    mockEditThunk.mockReturnValue(() => fakePromise);

    renderWithProviders(
      <div id='root'>
        <EditTransactionModal
          isOpen={true}
          onRequestClose={onRequestClose}
          transaction={fakeTransaction}
        />
      </div>
    );

    const transactionDescription = await screen.findByLabelText('Description');

    await userEvent.clear(transactionDescription);
    await userEvent.type(
      transactionDescription,
      "I've altered the desription. Pray I do not alter it further."
    );

    const saveButton = await screen.findByText(/save/i);
    await userEvent.click(saveButton);

    expect(mockEditThunk).toHaveBeenCalledWith({
      ...fakeTransaction,
      description:
        "I've altered the desription. Pray I do not alter it further.",
    });
  });
});
