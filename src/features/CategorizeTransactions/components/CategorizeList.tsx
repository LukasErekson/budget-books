import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Account from '../../Accounts/types/types';
import Transaction from '../../Transactions/types/types';

import { TbSortAscending, TbSortDescending } from 'react-icons/tb';

import { AddTxnForm } from '../';
import { CategorizeTxnForm } from '../';

import { RootState } from '../../../stores/store';
import { selectUncategorizedTransactions } from '../../Transactions/stores/transactionSelectors';

import { BsHandThumbsUp } from 'react-icons/bs';
import { ThreeDots } from 'react-loader-spinner';
import {
  Checkbox,
  FormControl,
  InputLabel,
  TextField,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

type SortDataObj = {
  mode: string;
  ascending: boolean;
};

function CategorizeList(props: {
  account: Account;
  showAddNewTxn?: boolean;
  setShowAddNewTxn: (show: boolean) => void;
  setSelectedTransactions: (
    callback: (prev: Transaction[]) => Transaction[]
  ) => void;
  addSelectedTransaction: (
    transactionToAdd: Transaction,
    index: number,
    keyPressed: boolean,
    sortedTransactions: Transaction[]
  ) => void;
  removeSelectedTransaction: (
    transactionToRemove: Transaction,
    index: number,
    keyPressed: boolean,
    sortedTransactions: Transaction[]
  ) => void;
  startingPosition: number;
  numTransactionsToDisplay: number;
}): JSX.Element {
  const transactions: Transaction[] = useSelector((state: RootState) =>
    props.account.id
      ? selectUncategorizedTransactions(state, props.account.id)
      : []
  );
  const isTransactionsLoaded: boolean = useSelector(
    (state: RootState) => state.transactions.isTransactionsLoaded
  );

  const [sortData, setSortData] = useState<SortDataObj>({
    mode: 'date',
    ascending: true,
  });

  const [searchInput, setSearchInput] = useState<string>('');

  const [selectAllTransactions, setSelectAllTransactions] =
    useState<boolean>(false);

  const debitInc = props.account.debit_inc === 1;

  const sortedTransactions = searchInput
    ? transactions
        .filter((transaction: Transaction) => {
          const input: string = searchInput.toLocaleLowerCase();
          return (
            transaction.name.toLocaleLowerCase().includes(input) ||
            transaction.description.toLocaleLowerCase().includes(input)
          );
        })
        .sort(sortTransactionsFunc())
    : transactions.sort(sortTransactionsFunc());

  const pageTransactions = useMemo<Transaction[]>(
    () =>
      sortedTransactions.slice(
        props.startingPosition,
        props.startingPosition + props.numTransactionsToDisplay
      ),
    [sortedTransactions]
  );

  function sortTransactionsFunc(): (a: Transaction, b: Transaction) => number {
    const { mode, ascending } = sortData;
    let compareFn: (a: Transaction, b: Transaction) => number;
    switch (mode) {
      case 'amount':
        compareFn = (a, b) => {
          const debitA: boolean = a.debit_account_id !== 'undefined';
          const amountA: number =
            (debitA && debitInc) || (!debitA && !debitInc)
              ? -a.amount
              : a.amount;
          const debitB: boolean = b.debit_account_id !== 'undefined';
          const amountB: number =
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
          const dateA: Date = new Date(a.transaction_date);
          const dateB: Date = new Date(b.transaction_date);
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
      const tempCompareFn = compareFn;
      compareFn = (a, b) => -tempCompareFn(a, b);
    }

    return compareFn;
  }

  function sortBy(mode: string): void {
    if (mode === sortData.mode) {
      setSortData((prev: SortDataObj) => ({
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
      <div
        className='search-categorize-txns-container'
        style={{
          marginTop: '-3.25rem',
          textAlign: 'left',
          paddingBottom: '.5rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SearchIcon />
        <TextField
          type={'search'}
          inputProps={{ className: 'search-categorize-txns' }}
          label={'Search Transactions'}
          size={'small'}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>
      <div className='txn-form-container'>
        <div className='categorize-txn-form txn-form-header-row'>
          <span>
            <Tooltip
              title={
                selectAllTransactions
                  ? 'Deselect all on page'
                  : 'Select all on page'
              }
              placement='top'
              arrow
            >
              <FormControl>
                <InputLabel
                  htmlFor='select-all-transactions-checkbox'
                  style={{ display: 'none' }}
                >
                  Select All Checkbox
                </InputLabel>
                <Checkbox
                  id='select-all-transactions-checkbox'
                  value={selectAllTransactions}
                  onChange={(event) => {
                    setSelectAllTransactions(event.target.checked);
                    if (event.target.checked) {
                      props.setSelectedTransactions((prev: Transaction[]) => {
                        const prevIds: number[] = prev.map(
                          (transaction: Transaction) => transaction.id
                        );
                        pageTransactions.forEach((transaction: Transaction) => {
                          if (!prevIds.includes(transaction.id)) {
                            prev.push(transaction);
                          }
                        });
                        return [...prev];
                      });
                      return;
                    }
                    props.setSelectedTransactions((prev: Transaction[]) => {
                      const removeIds: number[] = pageTransactions.map(
                        (transaction: Transaction) => transaction.id
                      );
                      return prev.filter(
                        (transaction: Transaction) =>
                          !removeIds.includes(transaction.id)
                      );
                    });
                  }}
                />
              </FormControl>
            </Tooltip>
          </span>
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
          pageTransactions.length ? (
            pageTransactions.map(
              (
                txn: Transaction,
                index: number,
                sortedTransactions: Transaction[]
              ) => (
                <CategorizeTxnForm
                  key={txn.id}
                  transacitonData={txn}
                  debitInc={debitInc}
                  account={props.account}
                  selectTransaction={props.addSelectedTransaction}
                  unSelectTransaction={props.removeSelectedTransaction}
                  listIndex={index}
                  sortedTransactions={sortedTransactions}
                />
              )
            )
          ) : searchInput ? (
            <span
              style={{
                margin: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p>No transactions in {props.account.name} match your search.</p>
              <SearchOffIcon />
            </span>
          ) : (
            <span
              style={{
                margin: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p>
                No transactions to categorize for {props.account.name}. Great
                work!
              </p>
              <BsHandThumbsUp size={24} />
            </span>
          )
        ) : (
          <div className='loading-screen'>
            <ThreeDots
              height='80'
              width='80'
              radius='5'
              color='#cccccc'
              ariaLabel='three-dots-loading'
              wrapperStyle={{
                width: '80px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '5rem',
              }}
              visible={true}
            />
            <p>Loading transactions...</p>
          </div>
        )}
      </div>
    </>
  );
}

export default CategorizeList;
