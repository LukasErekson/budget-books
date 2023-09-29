import React from 'react';
import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';
import { ImportedTransactionData } from '../../features/CategorizeTransactions/components/UploadTxnModal';
import { UploadableTransaction } from '../../features/CategorizeTransactions/types/types';
import * as TransactionThunks from '../../features/Transactions/stores/transactionThunks';

import { UploadTxnModal } from '../../features/CategorizeTransactions';
import { RootState, setupStore } from '../../stores/store';
import { mockThunkReturn, renderWithProviders } from '../setupTests';

import ReactModal from 'react-modal';
import { fakeAccounts } from '../Accounts/mockAccounts';
ReactModal.setAppElement('body');

let dataHandler = jest.fn();
const Importer = jest.fn();

jest.mock('react-csv-importer', () => ({
  Importer: (props: any) => {
    Importer(props);
    dataHandler = props.dataHandler;
    return (
      <div id='importer-mock' role='button'>
        <input type='file' name='file-mock' id='file-mock' />;
      </div>
    );
  },
  ImporterField: (props: any) => {
    return <div>Importer Field</div>;
  },
}));

describe('Upload Transaction Modal', () => {
  let testStore: RootState;
  const onRequestClose = jest.fn();
  const activeAccount: Account = fakeAccounts[0];

  beforeAll(() => {
    testStore = setupStore({
      pageSlice: {
        categorizationPage: {
          activeAccount: activeAccount,
        },
      },
    });
  });

  it('Renders without error', async () => {
    renderWithProviders(
      <div id='root'>
        <UploadTxnModal isOpen={true} onRequestClose={onRequestClose} />
      </div>,
      {
        store: testStore,
      }
    );

    const header = await screen.findByText('Upload Transactions');

    expect(header).toBeVisible();
  });

  describe('Setting up transaction data', () => {
    it('Dispatches the correct uploadable transactions on submit', async () => {
      const uploadTransactions = jest.spyOn(
        TransactionThunks,
        'uploadTransactions'
      );
      uploadTransactions.mockReturnValue(mockThunkReturn);

      renderWithProviders(
        <div id='root'>
          <UploadTxnModal isOpen={true} onRequestClose={onRequestClose} />
        </div>,
        {
          store: testStore,
        }
      );

      const checkbox = (await screen.findByLabelText(
        'Use one column for amount?'
      )) as HTMLInputElement;

      await act(async () => {
        await userEvent.click(checkbox);
      });

      expect(checkbox.value).toEqual('0');

      const csvRowData: ImportedTransactionData[] = [
        {
          date: '1/3/2023',
          name: 'Walmart',
          description: '',
          credit_amount: 20.75,
        },
      ];

      // Mimic the call on submit for react-csv-importer
      dataHandler(csvRowData);

      // Expected return form internal "prepTransactionsForUpload"
      const prepredTransactionsForUpload: UploadableTransaction[] = [
        {
          name: 'Walmart',
          description: '',
          amount: 20.75,
          debit_account_id: 1,
          credit_account_id: undefined,
          transaction_date: '2023-01-03',
        },
      ];

      expect(uploadTransactions).toHaveBeenCalledWith(
        activeAccount,
        prepredTransactionsForUpload
      );
    });

    it('Process data if onColumnAmounts is checked', async () => {
      const uploadTransactions = jest.spyOn(
        TransactionThunks,
        'uploadTransactions'
      );
      uploadTransactions.mockReturnValue(mockThunkReturn);

      renderWithProviders(
        <div id='root'>
          <UploadTxnModal isOpen={true} onRequestClose={onRequestClose} />
        </div>,
        {
          store: testStore,
        }
      );

      const csvRowData: ImportedTransactionData[] = [
        {
          date: '1/3/2023',
          name: 'Walmart',
          description: '',
          amount: 20.75,
        },
      ];

      // Mimic the call on submit for react-csv-importer
      dataHandler(csvRowData);
      // Expected return form internal "prepTransactionsForUpload"
      const prepredTransactionsForUpload: UploadableTransaction[] = [
        {
          name: 'Walmart',
          description: '',
          amount: 20.75,
          debit_account_id: 1,
          credit_account_id: undefined,
          transaction_date: '2023-01-03',
        },
      ];

      expect(uploadTransactions).toHaveBeenCalledWith(
        activeAccount,
        prepredTransactionsForUpload
      );
    });
  });
});
