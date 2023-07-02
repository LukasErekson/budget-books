import React from 'react';

import { IoMdWarning } from 'react-icons/io';

import Transaction from '../../Transactions/types/types';

import ModalBase from '../../../components/ModalBase';
import { useThunkDispatch } from '../../../hooks/hooks';
import { pyToJsDate } from '../../../utils/TextFilters';
import { deleteTransactions } from '../../Transactions/stores/transactionThunks';
import { Button } from '@mui/material';

interface deleteTxnModalProps {
  isOpen: boolean;
  onRequestClose:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | any;
  transactionData: Transaction;
  amountIsNegative?: boolean;
}

function DeleteTxnModal(props: deleteTxnModalProps): JSX.Element {
  const thunkDispatch = useThunkDispatch();

  function deleteTransaction(): void {
    thunkDispatch(deleteTransactions([props.transactionData]));
  }

  return (
    <ModalBase
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      title='Delete Transaction?'
      portalClassName='delete-txn-modal'
    >
      <p>Are you sure you want to delete the following transaction?</p>

      <div className='delete-txn-txn-container muted'>
        <p>{pyToJsDate(props.transactionData.transaction_date)}</p>
        <p>
          {props.transactionData.name.slice(0, 16) +
            (props.transactionData.name.length > 19
              ? '...'
              : props.transactionData.name.slice(16, 19))}
        </p>
        <p className={props.amountIsNegative ? 'negative' : 'positive'}>
          ${props.transactionData.amount}
        </p>
      </div>

      <p className='warn center'>
        <IoMdWarning style={{ fontSize: '2rem', margin: '-.5rem' }} />
      </p>
      <p className='warn center'>There is no undoing this action.</p>

      <div className='delete-modal-options'>
        <Button
          variant='contained'
          color='warning'
          onClick={() => {
            deleteTransaction();
            props.onRequestClose();
          }}
        >
          Yes
        </Button>
        <Button variant='contained' onClick={props.onRequestClose}>
          No
        </Button>
      </div>
    </ModalBase>
  );
}

export default DeleteTxnModal;
