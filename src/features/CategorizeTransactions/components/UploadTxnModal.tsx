import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { BaseRow, Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';

import Account from '../../Accounts/types/types';
import { UploadableTransaction } from '../types/types';

import ModalBase from '../../../components/ModalBase';
import { useThunkDispatch } from '../../../hooks/hooks';
import { RootState } from '../../../stores/store';
import { yearMonthDay } from '../../../utils/TextFilters';
import { uploadTransactions } from '../../Transactions/stores/transactionThunks';
import { Checkbox } from '@mui/material';

type UploadTransactionModalProps = {
  isOpen: boolean;
  onRequestClose:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | any;
};

export type ImportedTransactionData = {
  date: string;
  name: string;
  description: string;
  amount?: number;
  debit_amount?: number;
  credit_amount?: number;
};

const transactionsToUpload: {
  transactions: UploadableTransaction[];
  indicies: number[];
} = {
  transactions: [],
  indicies: [],
};

function UploadTxnModal(props: UploadTransactionModalProps): JSX.Element {
  const thunkDispatch = useThunkDispatch();
  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.categorizationPage.activeAccount
  );

  const [oneColumnAmounts, setOneColumnAmounts] = useState<boolean>(false);

  function processRowData(
    uploadCandidates: ImportedTransactionData[]
  ): UploadableTransaction[] {
    return uploadCandidates.map((transaction: ImportedTransactionData) => {
      const transaction_date: string = yearMonthDay(new Date(transaction.date));
      const name: string = transaction.name;
      const description: string = transaction.description;
      let debit_account_id: number | undefined;
      let credit_account_id: number | undefined;
      let amount: number;
      if (oneColumnAmounts) {
        amount =
          transaction.amount !== undefined ? Math.abs(transaction.amount) : 0;

        if (activeAccount.debit_inc) {
          if (transaction.amount && transaction.amount > 0) {
            debit_account_id = activeAccount.id;
          } else {
            credit_account_id = activeAccount.id;
          }
        } else {
          if (transaction.amount && transaction.amount > 0) {
            credit_account_id = activeAccount.id;
          } else {
            debit_account_id = activeAccount.id;
          }
        }
      } else {
        if (transaction.debit_amount) {
          credit_account_id = activeAccount.id;
        } else {
          debit_account_id = activeAccount.id;
        }
        amount = transaction.debit_amount || transaction.credit_amount || 0;
      }

      const uploadableTransaction = {
        name,
        description,
        amount,
        debit_account_id,
        credit_account_id,
        transaction_date,
      };

      return uploadableTransaction;
    });
  }

  return (
    <ModalBase
      isOpen={props.isOpen}
      onRequestClose={() => {
        setOneColumnAmounts(true);
        transactionsToUpload.transactions = [];
        transactionsToUpload.indicies = [];
        props.onRequestClose();
      }}
      title='Upload Transactions'
      style={{
        content: {
          height: 'fit-content',
          margin: 'auto',
          marginRight: 'auto',
        },
      }}
      portalClassName='delete-txn-modal'
    >
      <div className='one-col-checkbox-container'>
        <div className='on-col-checkbox'>
          <label htmlFor='one-col-amt-checkbox'>
            Use one column for amount?
          </label>
          <Checkbox
            id='one-col-amt-checkbox'
            value={oneColumnAmounts}
            onChange={(event) => setOneColumnAmounts(event.target.checked)}
          />
        </div>
        <p className={oneColumnAmounts ? 'unhide' : 'hide'}>
          {`(Positive numbers are ${
            activeAccount.debit_inc ? 'debits' : 'credits'
          }, negative numbers are
            ${!activeAccount.debit_inc ? 'debits' : 'credits'})`}
        </p>
      </div>

      <Importer
        dataHandler={async (
          potentialTransactions: BaseRow[],
          { startIndex }
        ) => {
          if (transactionsToUpload.indicies.includes(startIndex)) {
            return;
          }
          transactionsToUpload.transactions =
            transactionsToUpload.transactions.concat(
              processRowData(potentialTransactions as ImportedTransactionData[])
            );

          transactionsToUpload.indicies.push(startIndex);
        }}
        onComplete={(info) => {
          thunkDispatch(
            uploadTransactions(activeAccount, transactionsToUpload.transactions)
          );

          transactionsToUpload.transactions = [];
          transactionsToUpload.indicies = [];

          props.onRequestClose();
        }}
      >
        <ImporterField name='date' label='Date' />
        <ImporterField name='name' label='Name' />
        <ImporterField name='description' label='Description' />

        {oneColumnAmounts ? (
          <ImporterField name='amount' label='Amount' />
        ) : (
          <>
            <ImporterField name='credit_amount' label='Credit' />{' '}
            <ImporterField name='debit_amount' label='Debit' />
          </>
        )}
      </Importer>
    </ModalBase>
  );
}

export default UploadTxnModal;
