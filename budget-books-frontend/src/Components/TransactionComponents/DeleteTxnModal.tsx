import React, { FC } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdWarning } from 'react-icons/io';

import Modal from 'react-modal';
import { pyToJsDate } from '../../Common/TextFilters';
import { useThunkDispatch } from '../../hooks';
import { deleteTransactions } from './transactionThunks';
import Transaction from './transactionTSTypes';

interface deleteTxnModalProps {
  isOpen: boolean;
  onRequestClose:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | any;
  transactionData: Transaction;
  amountIsNegative?: boolean;
}

const DeleteTxnModal: FC<deleteTxnModalProps> = (
  props: deleteTxnModalProps
): JSX.Element => {
  const thunkDispatch = useThunkDispatch();

  function deleteTransaction(): void {
    thunkDispatch(deleteTransactions([props.transactionData]));
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      appElement={document.getElementById('root') || undefined}
      style={{
        content: {
          height: 'fit-content',
          width: 'fit-content',
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
      <h3>Delete Transaction?</h3>
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

      <p className='alert center'>
        <IoMdWarning style={{ fontSize: '2rem', margin: '-.5rem' }} />
      </p>
      <p className='alert center'>There is no undoing this action.</p>

      <div className='delete-modal-options'>
        <button
          onClick={() => {
            deleteTransaction();
            props.onRequestClose();
          }}
          className='delete-modal-yes'
        >
          Yes
        </button>
        <button onClick={props.onRequestClose} className='delete-modal-no'>
          No
        </button>
      </div>
    </Modal>
  );
};

export default DeleteTxnModal;
