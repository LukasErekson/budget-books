import React, { useState } from 'react';
import { pyToJsDate } from '../../Common/TextFilters';
import AccountSelect from '../AccountComponents/AccountSelect';
import Account from '../AccountComponents/accountTSTypes';
import { addNewAccount } from '../AccountComponents/accountThunks';
import Transaction from './transactionTSTypes';
import { useThunkDispatch } from '../../hooks';
import { addTransactionCategory } from './transactionThunks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectAccounts } from '../AccountComponents/accountSelectors';
import { FiTrash2 } from 'react-icons/fi';
import ButtonWithToolTip from '../SharedComponents/ButtonWithToolTip';
import DeleteTxnModal from './DeleteTxnModal';

function CategorizeTxnForm(props: {
  transacitonData: Transaction;
  debitInc: boolean;
  account: Account;
}): JSX.Element {
  const { id, transaction_date, name, description, amount, debit_account_id } =
    props.transacitonData;

  const isDebitTransaction: boolean = debit_account_id !== 'undefined';

  const amountIsNegative: boolean =
    (isDebitTransaction && props.debitInc) ||
    (!isDebitTransaction && !props.debitInc);

  const accounts: Account[] = useSelector((state: RootState) =>
    selectAccounts(state)
  );

  let firstAccountIdx: number = 0;

  if (accounts.indexOf(props.account) === 0) {
    firstAccountIdx = 1;
  }

  const [category, setCategory]: [{ label: string; value: number }, Function] =
    useState({
      label: accounts[firstAccountIdx].name,
      value: accounts[firstAccountIdx].id,
    });

  const [inputCategory, setInputCategory]: [string, Function] = useState('');

  const [displayDeleteModal, setDisplayDeleteModal]: [boolean, Function] =
    useState(false);

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
          formDiv.lastElementChild.classList.contains('transaction-details')
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
        {pyToJsDate(transaction_date)}
      </span>{' '}
      <span className='categorize-txn-item'>
        {name.slice(0, 16) + (name.length > 19 ? '...' : name.slice(16, 19))}
      </span>{' '}
      <span className='categorize-txn-item'>
        {description.slice(0, 32) +
          (description.length > 35 ? '...' : description.slice(32, 35))}
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
          <h4>{name}</h4>
          <h5>Description:</h5>
          <p>{description}</p>
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
