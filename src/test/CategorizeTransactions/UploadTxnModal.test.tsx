import React from 'react';
import { screen } from '@testing-library/react';

import Account from '../../features/Accounts/types/types';

import { UploadTxnModal } from '../../features/CategorizeTransactions';
import { RootState, setupStore } from '../../stores/store';
import { renderWithProviders } from '../setupTests';

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

    const oneColumnCheckbox = (await screen.findByLabelText(
      'Use one column for amount?'
    )) as HTMLInputElement;

    expect(oneColumnCheckbox.checked).toBe(false);
  });
});
