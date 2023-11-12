import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import { FiEdit, FiTrash2 } from 'react-icons/fi';

import Account from '../../Accounts/types/types';
import Transaction from '../../Transactions/types/types';

import { RootState } from '../../../stores/store';
import { useThunkDispatch } from '../../../hooks/hooks';
import { addNewAccount } from '../../Accounts/stores/accountThunks';
import { selectAccounts } from '../../Accounts/stores/accountSelectors';
import { addTransactionCategory } from '../../Transactions/stores/transactionThunks';

import { pyToJsDate } from '../../../utils/TextFilters';
import { AccountDropdownSelect, NewAccountModal } from '../../Accounts';
import ButtonWithToolTip from '../../../components/ButtonWithToolTip';
import { DeleteTxnModal } from '../';
import { Checkbox } from '@mui/material';
import { EditTransactionModal } from '../../Transactions';
import AccountType from '../../AccountTypes/types/types';

function CategorizeTxnForm(props: {
  transacitonData: Transaction;
  debitInc: boolean;
  account: Account;
  selectTransaction: (
    arg0: Transaction,
    index: number,
    keyPressed: boolean,
    sortedTransactions: Transaction[]
  ) => void;
  unSelectTransaction: (
    arg0: Transaction,
    index: number,
    keyPressed: boolean,
    sortedTransactions: Transaction[]
  ) => void;
  listIndex: number;
  sortedTransactions?: Transaction[];
}): JSX.Element {
  const {
    id,
    date_entered,
    transaction_date,
    name,
    description,
    amount,
    debit_account_id,
  } = props.transacitonData;

  const isDebitTransaction: boolean = debit_account_id !== 'undefined';

  const amountIsNegative = !isDebitTransaction;

  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  const firstAccountIdx: number = accounts.indexOf(props.account) === 0 ? 1 : 0;

  const [category, setCategory] = useState<Account>(accounts[firstAccountIdx]);

  const [inputCategory, setInputCategory] = useState<string>('');

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [showNewAccountModal, setShowNewAccountModal] =
    useState<boolean>(false);

  const isSelected = useSelector(
    (state: RootState) => state.transactions.selectedTransactions || []
  ).includes(props.transacitonData);

  const nameCell = useRef<HTMLSpanElement>(null);
  const [nameCharWidth, setNameCharWidth] = useState<number>(16);

  const descriptionCell = useRef<HTMLSpanElement>(null);
  const [descriptionCellWidth, setDescriptionCellWidth] = useState<number>(32);

  const getCellWidths = () => {
    const newNameWidth: number | undefined = nameCell.current?.offsetWidth;
    setNameCharWidth(newNameWidth ? Math.floor(newNameWidth / 10) : 16);

    const newDescriptionCellWidth: number | undefined =
      descriptionCell.current?.offsetWidth;
    setDescriptionCellWidth(
      newDescriptionCellWidth ? Math.floor(newDescriptionCellWidth / 10) : 32
    );
  };

  useEffect(() => {
    window.addEventListener('resize', getCellWidths);

    return () => {
      window.removeEventListener('resize', getCellWidths);
    };
  }, []);

  const thunkDispatch = useThunkDispatch();

  function postCategorizeTransaction(
    transaction_id: number,
    category_id: number
  ) {
    if (category_id === -1) {
      setShowNewAccountModal(true);
      return;
    }

    thunkDispatch(
      addTransactionCategory(
        props.account,
        transaction_id,
        category_id,
        isDebitTransaction ? 'credit' : 'debit' // Flipped for what needs to be categorized.
      )
    );
  }

  function toggleDetailVisibility(event: any): void {
    let transactionDetails;
    let formDiv;

    switch (event.target.tagName) {
      case 'BUTTON':
        return;
      case 'DIV':
        formDiv = event.target;
        if (formDiv.classList.contains('hide')) {
          transactionDetails = formDiv;
        } else if (
          formDiv.lastElementChild?.classList.contains('transaction-details')
        ) {
          transactionDetails = formDiv.lastElementChild;
        } else {
          return;
        }
        break;
      case 'SPAN':
        formDiv = event.target.parentNode;
        transactionDetails = formDiv.lastElementChild;
        break;
      default:
        return;
    }

    transactionDetails?.classList.toggle('hide');
    transactionDetails?.classList.toggle('unhide');
    return;
  }

  return (
    <div
      className={
        'categorize-txn-form ' +
        (isSelected ? 'categorize-txn-form-selected' : '')
      }
      key={id}
      onClick={toggleDetailVisibility}
    >
      <span className='categorize-txn-item'>
        <Checkbox
          name='selected'
          id={'$checkbox-{id}'}
          style={{ width: '1rem', height: '1rem' }}
          checked={isSelected}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            let shiftPressed: boolean = false;
            if ('shiftKey' in event.nativeEvent) {
              shiftPressed = Boolean(event.nativeEvent.shiftKey);
            }
            if (isSelected) {
              props.unSelectTransaction(
                props.transacitonData,
                props.listIndex,
                shiftPressed,
                props.sortedTransactions || []
              );
              return;
            }
            props.selectTransaction(
              props.transacitonData,
              props.listIndex,
              shiftPressed,
              props.sortedTransactions || []
            );
          }}
        />
      </span>{' '}
      <span className='categorize-txn-item'>
        {pyToJsDate(transaction_date)}
      </span>{' '}
      <span className='categorize-txn-item' ref={nameCell}>
        {name.slice(0, nameCharWidth) +
          (name.length > nameCharWidth + 3
            ? '...'
            : name.slice(nameCharWidth, nameCharWidth + 3))}
      </span>{' '}
      <span className='categorize-txn-item' ref={descriptionCell}>
        {description.slice(0, descriptionCellWidth) +
          (description.length > descriptionCellWidth + 3
            ? '...'
            : description.slice(descriptionCellWidth))}
      </span>{' '}
      <span
        className={
          'categorize-txn-item' + (amountIsNegative ? ' negative' : ' positive')
        }
      >
        {amountIsNegative && '-'}${amount}
      </span>
      <span className='categorize-txn-item'>
        <AccountDropdownSelect
          value={category}
          setValue={setCategory}
          inputValue={inputCategory}
          setInputValue={setInputCategory}
          excludeAccount={props.account}
        />
      </span>
      <span className='categorize-txn-item'>
        <button
          className='categorize-txn-btn'
          onClick={() => postCategorizeTransaction(id, category.id)}
        >
          Add
        </button>
      </span>
      <div className='transaction-details hide'>
        <div className='transaction-description'>
          <h4 className='muted'>{name}</h4>
          <h5>Description:</h5>
          <p>{description}</p>

          <p className='muted'>
            Transaction updated on {pyToJsDate(date_entered)}
          </p>
        </div>
        <div
          className='transction-form-btn-container'
          style={{ gap: 10, display: 'flex', justifyContent: 'flex-end' }}
        >
          <ButtonWithToolTip
            onClick={() => setShowEditModal(true)}
            toolTipContent={'Edit Transaction'}
            className='edit-transaction'
          >
            <FiEdit />
          </ButtonWithToolTip>
          <ButtonWithToolTip
            onClick={() => {
              setShowDeleteModal(true);
            }}
            toolTipContent={'Delete Transaction'}
            className='delete-transaction'
          >
            <FiTrash2 />
          </ButtonWithToolTip>
        </div>

        <DeleteTxnModal
          isOpen={showDeleteModal}
          onRequestClose={() => {
            setShowDeleteModal(false);
          }}
          transactionData={props.transacitonData}
          amountIsNegative={amountIsNegative}
        />

        <EditTransactionModal
          isOpen={showEditModal}
          onRequestClose={() => {
            setShowEditModal(false);
          }}
          transaction={props.transacitonData}
        />

        {category.id === -1 ? (
          <NewAccountModal
            isOpen={showNewAccountModal}
            onRequestClose={() => {
              setShowNewAccountModal(false);
            }}
            accountName={category.id === -1 ? inputCategory : undefined}
            onPostCallback={(accountName: string) => {
              const categoryAccount: Account =
                accounts.find(
                  (account: Account) => account.name === accountName
                ) ||
                ({
                  id:
                    Math.max(
                      ...accounts.map((account: Account) => +account.id)
                    ) + 1,
                  name: accountName,
                } as Account);

              setCategory(categoryAccount);
            }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default CategorizeTxnForm;
