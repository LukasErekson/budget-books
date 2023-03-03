import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Modal from 'react-modal';
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';

import { AiOutlineClose } from 'react-icons/ai';

import Account from '../../Accounts/types/types';
import { UploadableTransaction } from '../types/types';

import { yearMonthDay } from '../../../utils/TextFilters';
import { RootState } from '../../../stores/store';
import { useThunkDispatch } from '../../../hooks/hooks';
import { uploadTransactions } from '../../Transactions/stores/transactionThunks';

interface addTxnModalProps {
  isOpen: boolean;
  onRequestClose:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | any;
}

type ImportedTransactionData = {
  date: string;
  name: string;
  description: string;
  amount?: number;
  debit_amount?: number;
  credit_amount?: number;
};

function UploadTxnModal(props: addTxnModalProps): JSX.Element {
  const thunkDispatch = useThunkDispatch();
  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.categorizationPage.activeAccount
  );

  const [oneColumnAmounts, setOneColumnAmounts]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(1);

  function prepTransactionsForUpload(
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
    <Modal
      isOpen={props.isOpen}
      onRequestClose={() => {
        setOneColumnAmounts(1);
        props.onRequestClose();
      }}
      appElement={document.getElementById('root') || undefined}
      style={{
        content: {
          height: 'fit-content',
          width: 'min(80%, 550px)',
          margin: 'auto',
          marginRight: 'auto',
        },
      }}
      portalClassName='delete-txn-modal'
    >
      <AiOutlineClose
        onClick={props.onRequestClose}
        className='close-modal-x'
      />
      <h3>Upload Transactions</h3>

      <input
        type='checkbox'
        name='one_column_amount'
        id='one-col-amt-checkbox'
        value={oneColumnAmounts}
        onChange={() => setOneColumnAmounts((prev: number) => (prev + 1) % 2)}
        defaultChecked={oneColumnAmounts === 1}
      />
      <label htmlFor='one-column-amount'>Use one column for amount?</label>

      <p>
        {oneColumnAmounts
          ? `(Positive numbers are ${
              activeAccount.debit_inc ? 'debits' : 'credits'
            }, negative numbers are
          ${!activeAccount.debit_inc ? 'debits' : 'credits'})`
          : ''}
      </p>

      <Importer
        dataHandler={async (potentialTransactions) => {
          // required, receives a list of parsed objects based on defined fields and user column mapping;
          // may be called several times if file is large
          // (if this callback returns a promise, the widget will wait for it before parsing more data)
          console.log('received batch of rows', potentialTransactions);

          // mock timeout to simulate processing
          thunkDispatch(
            uploadTransactions(
              activeAccount,
              prepTransactionsForUpload(
                potentialTransactions as ImportedTransactionData[]
              )
            )
          );
        }}
        onComplete={props.onRequestClose}
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
    </Modal>
  );
}

export default UploadTxnModal;
