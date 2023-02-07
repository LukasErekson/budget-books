import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Account from '../../AccountComponents/accountTSTypes';
import AddTxnForm from '../AddTxnForm';
import CategorizeTxnForm from './CategorizeTxnForm';
import { selectUncategorizedTransactions } from '../transactionSelectors';
import Transaction from '../transactionTSTypes';

import { TbSortAscending, TbSortDescending } from 'react-icons/tb';

type sortDataObj = {
  mode: string;
  ascending: boolean;
};

function CategorizeList(props: {
  account: Account;
  showAddNewTxn?: Boolean;
  setShowAddNewTxn: Function;
  selectedTransactions: Transaction[];
  setSelectedTransactions: Function;
  addSelectedTransaction: Function;
  removeSelectedTransaction: Function;
}): JSX.Element {
  const transactions: Transaction[] = useSelector((state: RootState) =>
    props.account.id
      ? selectUncategorizedTransactions(state, props.account.id)
      : []
  );

  const isTransactionsLoaded: boolean = useSelector(
    (state: RootState) => state.transactions.isTransactionsLoaded
  );

  const [sortData, setSortData]: [sortDataObj, Function] = useState({
    mode: 'date',
    ascending: true,
  });

  const debitInc = props.account.debit_inc === 1;

  function sortTransactionsFunc(
    mode: string,
    ascending: boolean = true
  ): (a: Transaction, b: Transaction) => number {
    let compareFn: (a: Transaction, b: Transaction) => number;
    switch (mode) {
      case 'amount':
        compareFn = (a, b) => {
          const debitA: boolean = a.debit_account_id !== 'undefined';
          let amountA: number =
            (debitA && debitInc) || (!debitA && !debitInc)
              ? -a.amount
              : a.amount;
          const debitB: boolean = b.debit_account_id !== 'undefined';
          let amountB: number =
            (debitB && debitInc) || (!debitB && !debitInc)
              ? -b.amount
              : b.amount;

          if (amountA < amountB) {
            return -1;
          } else if (amountA > amountB) {
            return 1;
          } else {
            return 0;
          }
        };
        break;
      case 'name':
        compareFn = (a, b) => {
          return a.name.localeCompare(b.name);
        };
        break;
      case 'description':
        compareFn = (a, b) => {
          return a.description.localeCompare(b.description);
        };
        break;
      case 'date':
      default:
        compareFn = (a, b) => {
          let dateA: Date = new Date(a.transaction_date);
          let dateB: Date = new Date(b.transaction_date);
          if (dateA < dateB) {
            return -1;
          } else if (dateB < dateA) {
            return 1;
          } else {
            return 0;
          }
        };
        break;
    }

    if (!ascending) {
      let tempCompareFn = compareFn;
      compareFn = (a, b) => -tempCompareFn(a, b);
    }

    return compareFn;
  }

  function sortBy(mode: string): void {
    if (mode === sortData.mode) {
      setSortData((prev: sortDataObj) => ({
        mode,
        ascending: !prev.ascending,
      }));
      return;
    }

    // Default sorting by ascending
    setSortData({
      mode,
      ascending: true,
    });
    return;
  }

  return (
    <>
      <div className='txn-form-container'>
        <div className='categorize-txn-form txn-form-header-row'>
          <span></span>
          <span
            className='categorize-txn-item txn-form-header'
            onClick={() => sortBy('date')}
          >
            <span className='sort-icons'>
              {sortData.mode === 'date' ? (
                sortData.ascending ? (
                  <TbSortAscending />
                ) : (
                  <TbSortDescending />
                )
              ) : (
                ''
              )}
            </span>
            Date
          </span>{' '}
          <span
            className='categorize-txn-item txn-form-header'
            onClick={() => sortBy('name')}
          >
            <span className='sort-icons'>
              {sortData.mode === 'name' ? (
                sortData.ascending ? (
                  <TbSortAscending />
                ) : (
                  <TbSortDescending />
                )
              ) : (
                ''
              )}
            </span>
            Name
          </span>{' '}
          <span
            className='categorize-txn-item txn-form-header'
            onClick={() => sortBy('description')}
          >
            <span className='sort-icons'>
              {sortData.mode === 'description' ? (
                sortData.ascending ? (
                  <TbSortAscending />
                ) : (
                  <TbSortDescending />
                )
              ) : (
                ''
              )}
            </span>
            Description
          </span>{' '}
          <span
            className='categorize-txn-item txn-form-header'
            onClick={() => sortBy('amount')}
          >
            <span className='sort-icons'>
              {sortData.mode === 'amount' ? (
                sortData.ascending ? (
                  <TbSortAscending />
                ) : (
                  <TbSortDescending />
                )
              ) : (
                ''
              )}
            </span>
            Amount
          </span>
          <span className='categorize-txn-item txn-form-header'>Account</span>
          <span className='categorize-txn-item txn-form-header'></span>
        </div>
        {props.showAddNewTxn ? (
          <AddTxnForm
            account={props.account}
            debitInc={debitInc}
            setShowAddNewTxn={props.setShowAddNewTxn}
          />
        ) : (
          ''
        )}
        {isTransactionsLoaded ? (
          transactions
            .sort(sortTransactionsFunc(sortData.mode, sortData.ascending))
            .map((txn: Transaction) => (
              <CategorizeTxnForm
                key={txn.id}
                transacitonData={txn}
                debitInc={debitInc}
                account={props.account}
                isSelected={props.selectedTransactions.includes(txn) ? 1 : 0}
                selectTransaction={props.addSelectedTransaction}
                unSelectTransaction={props.removeSelectedTransaction}
              />
            ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default CategorizeList;
