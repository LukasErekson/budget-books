import React, { FC, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdWarning } from 'react-icons/io';

import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { useThunkDispatch } from '../../hooks';
import { RootState } from '../../store';
import AccountSelect from '../AccountComponents/AccountSelect';
import Account from '../AccountComponents/accountTSTypes';
import Transaction from './transactionTSTypes';

type BulkActionModalProps = {
  isOpen: boolean;
  onRequestClose:
    | React.MouseEvent<Element, MouseEvent>
    | React.KeyboardEvent<Element>
    | any;
  selectedTransactions: Transaction[];
};

const BulkActionModal: FC<BulkActionModalProps> = (
  props: BulkActionModalProps
): JSX.Element => {
  const thunkDispatch = useThunkDispatch();

  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.categorizationPage.activeAccount
  );

  const [category, setCategory]: [{ label: string; value: number }, Function] =
    useState({ label: '', value: -2 });

  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      appElement={document.getElementById('root') || undefined}
      style={{
        content: {
          height: '50%',
          width: '50%',
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
      <h3>Bulk Actions</h3>
      <h4>{props.selectedTransactions.length} Selected Transactions</h4>

      <div className='bulk-categorize-form'>
        <AccountSelect
          setCategory={setCategory}
          category={category}
          setInputCategory={setInputCategory}
          inputCategory={inputCategory}
          excludeAccount={activeAccount}
        />
        <button>Categorize</button>
      </div>

      <button>Delete</button>
    </Modal>
  );
};

export default BulkActionModal;
