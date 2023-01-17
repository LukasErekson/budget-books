import React, { useEffect, useRef, useState } from 'react';
import { pyToJsDate } from '../../../Common/TextFilters';
import AccountSelect from '../../AccountComponents/AccountSelect';
import Account from '../../AccountComponents/accountTSTypes';
import { addNewAccount } from '../../AccountComponents/accountThunks';
import Transaction from '../transactionTSTypes';
import { useThunkDispatch } from '../../../hooks';
import { addTransactionCategory } from '../transactionThunks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectAccounts } from '../../AccountComponents/accountSelectors';
import { FiTrash2 } from 'react-icons/fi';
import ButtonWithToolTip from '../../SharedComponents/ButtonWithToolTip';
import DeleteTxnModal from '../DeleteTxnModal';

function CategorizeTxnForm(props: {
  transacitonData: Transaction;
  debitInc: boolean;
  account: Account;
  isSelected: number;
  selectTransaction: Function;
  unSelectTransaction: Function;
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

  const amountIsNegative: boolean = !isDebitTransaction;

  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  let firstAccountIdx: number = 0;

  if (accounts.indexOf(props.account) === 0) {
    firstAccountIdx = 1;
  }

  const [isSelected, setIsSelected]: [number, Function] = useState(
    props.isSelected
  );

  const [category, setCategory]: [{ label: string; value: number }, Function] =
    useState({
      label: accounts[firstAccountIdx].name,
      value: accounts[firstAccountIdx].id,
    });

  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  const [displayDeleteModal, setDisplayDeleteModal]: [boolean, Function] =
    useState(false);

  const nameCell = useRef<HTMLSpanElement>(null);
  const [nameCharWidth, setNameCharWidth]: [number, Function] = useState(16);

  const descriptionCell = useRef<HTMLSpanElement>(null);
  const [descriptionCellWidth, setDescriptionCellWidth]: [number, Function] =
    useState(32);

  const getCellWidths = () => {
    let newNameWidth: number | undefined = nameCell.current?.offsetWidth;
    setNameCharWidth(newNameWidth ? Math.floor(newNameWidth / 10) : 16);

    let newDescriptionCellWidth: number | undefined =
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
      thunkDispatch(addNewAccount(category.label, category, true));
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
      className='categorize-txn-form'
      key={id}
      onClick={toggleDetailVisibility}
    >
      <span className='categorize-txn-item'>
        <input
          type='checkbox'
          name='selected'
          id={`$checkbox-{id}`}
          value={isSelected}
          checked={isSelected === 1}
          onChange={() => {
            setIsSelected((prev: number) => (prev + 1) % 2);
            if (isSelected) {
              props.unSelectTransaction(props.transacitonData);
              return;
            }
            props.selectTransaction(props.transacitonData);
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
        <AccountSelect
          setCategory={setCategory}
          category={category}
          setInputCategory={setInputCategory}
          inputCategory={inputCategory}
          excludeAccount={props.account}
        />
      </span>
      <span className='categorize-txn-item'>
        <button
          className='categorize-txn-btn'
          onClick={() => postCategorizeTransaction(id, category.value)}
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
            Transaction entered on {pyToJsDate(date_entered)}
          </p>
        </div>
        <ButtonWithToolTip
          onClick={() => {
            setDisplayDeleteModal(true);
          }}
          toolTipContent={'Delete Transaction'}
          className='delete-transaction'
        >
          <FiTrash2 />
        </ButtonWithToolTip>

        <DeleteTxnModal
          isOpen={displayDeleteModal}
          onRequestClose={() => {
            setDisplayDeleteModal(false);
          }}
          transactionData={props.transacitonData}
          amountIsNegative={amountIsNegative}
        />
      </div>
    </div>
  );
}

export default CategorizeTxnForm;
