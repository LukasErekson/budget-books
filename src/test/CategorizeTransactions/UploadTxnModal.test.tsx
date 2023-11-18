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
import { open, readFile } from 'fs';
ReactModal.setAppElement('body');

let dataHandler = jest.fn();
const Importer = jest.fn();

jest.mock('react-csv-importer', () => ({
  Importer: (props: any) => {
    Importer(props);
    dataHandler = props.dataHandler;
    return (
      <div id='importer-mock' role='button'>
        <label htmlFor='file-mock'>Drag-and-drop CSV file</label>
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
});
