import React, { useState } from 'react';

import Account from '../features/Accounts/types/types';

import {
  selectTransactions,
  setTransactionsIsLoaded,
} from '../features/Transactions/stores/transactionSlice';
import { fetchAccountTransactions } from '../features/Transactions/stores/transactionThunks';
import { useAppDispatch, useThunkDispatch } from '../hooks/hooks';
import { RootState } from '../stores/store';

import { useSelector } from 'react-redux';

import { AccountCardContainer } from '../features/Accounts';

import { BiUpload } from 'react-icons/bi';
import { FiPlusCircle } from 'react-icons/fi';
import { IoMdRefresh } from 'react-icons/io';
import { RiCheckboxMultipleFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonWithToolTip from '../components/ButtonWithToolTip';
import {
  BulkActionModal,
  CategorizeList,
  UploadTxnModal,
} from '../features/CategorizeTransactions';
import { selectUncategorizedTransactions } from '../features/Transactions/stores/transactionSelectors';
import Transaction from '../features/Transactions/types/types';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

function CategorizeTransactionsPage() {
  const activeAccount: Account = useSelector(
    (state: RootState) => state.pageSlice.categorizationPage.activeAccount
  );

  const uncategorizedTransactions: Transaction[] = useSelector(
    (state: RootState) =>
      activeAccount.id
        ? selectUncategorizedTransactions(state, activeAccount.id)
        : []
  );
  const selectedTransactions: Transaction[] = useSelector(
    (state: RootState) => state.transactions.selectedTransactions
  );

  const numUncategorizedTransactions: number = uncategorizedTransactions.length;

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>();

  const dispatch = useAppDispatch();
  const thunkDispatch = useThunkDispatch();

  const setSelectedTransactions = (
    callback: (prev: Transaction[]) => Transaction[]
  ) => dispatch(selectTransactions(callback([...selectedTransactions])));

  const [currentPage, setCurrentPage] = useState<number>(0);

  const [numTransactionsToDisplay, setNumTransactionsToDisplay] =
    useState<number>(25);

  const pages: number[] = [];
  for (
    let i = 0;
    i < Math.ceil(numUncategorizedTransactions / numTransactionsToDisplay);
    i++
  ) {
    pages.push(i);
  }

  const [showaddNewTxn, setShowAddNewTxn] = useState<boolean>(false);

  const [showUploadTxnModal, setShowUploadTxnModal] = useState<boolean>(false);

  const [showBulkActionModal, setShowBulkActionModal] =
    useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>('');

  function transactionIndexRange(
    newIndex: number | undefined,
    sortedTransactions: Transaction[]
  ): Transaction[] {
    if (newIndex === undefined || lastSelectedIndex === undefined) {
      return [];
    }

    if (newIndex >= lastSelectedIndex) {
      return sortedTransactions.slice(lastSelectedIndex, newIndex + 1);
    } else {
      return sortedTransactions.slice(newIndex, lastSelectedIndex + 1);
    }
  }

  function addSelectedTransaction(
    newTransaction: Transaction,
    index: number,
    keyPressed: boolean = false,
    sortedTransactions: Transaction[]
  ): void {
    if (!keyPressed) {
      // Closure problem!!!
      if (
        !selectedTransactions
          .map((txn: Transaction) => txn.id)
          .includes(newTransaction.id)
      ) {
        setSelectedTransactions((prev: Transaction[]) => {
          prev.push(newTransaction);
          return prev;
        });
      }
    } else {
      const transactionRange: Transaction[] = transactionIndexRange(
        index,
        sortedTransactions
      );

      const transactionsToSelect: Transaction[] = [];

      transactionRange.forEach((transaction: Transaction) => {
        if (
          !selectedTransactions
            .map((txn: Transaction) => txn.id)
            .includes(transaction.id)
        ) {
          transactionsToSelect.push(transaction);
        }
      });
      setSelectedTransactions((prev: Transaction[]) => {
        return prev.concat(transactionsToSelect);
      });
    }
    setLastSelectedIndex(index);
  }

  function removeSelectedTransaction(
    removeTransaction: Transaction,
    index: number,
    keyPressed: boolean = false,
    sortedTransactions: Transaction[]
  ): void {
    if (!keyPressed) {
      setSelectedTransactions((prev: Transaction[]) =>
        prev.filter((txn: Transaction) => txn.id !== removeTransaction.id)
      );
      setLastSelectedIndex(index);
    } else {
      const transactionRange: Transaction[] = transactionIndexRange(
        index,
        sortedTransactions
      );

      const transactionsToDeselect: Transaction[] = [];

      transactionRange.forEach((transaction: Transaction) => {
        if (
          selectedTransactions
            .map((txn: Transaction) => txn.id)
            .includes(transaction.id)
        ) {
          transactionsToDeselect.push(transaction);
        }
      });

      const deselectIds: number[] = transactionsToDeselect.map(
        (txn: Transaction) => txn.id
      );

      setSelectedTransactions((prev: Transaction[]) =>
        prev.filter((txn: Transaction) => !deselectIds.includes(txn.id))
      );
    }
    setLastSelectedIndex(index);
  }

  function refreshTransactions(): void {
    const refreshIcon: Element =
      document.getElementsByClassName('refresh-icon')[0];

    refreshIcon.classList.toggle('rotate');

    dispatch(setTransactionsIsLoaded({ loaded: false }));
    thunkDispatch(fetchAccountTransactions(activeAccount, 'uncategorized'));

    setSelectedTransactions((prev: Transaction[]) => []);

    setTimeout(() => {
      refreshIcon.classList.toggle('rotate');
    }, 750);
  }

  function transactionsPerPageLink(perPageNum: number): JSX.Element {
    return (
      <a
        key={`transactionsPerPage${perPageNum}`}
        className={
          numTransactionsToDisplay == perPageNum ? 'active-txn-num' : ''
        }
        onClick={() => {
          setNumTransactionsToDisplay(perPageNum);
          if (currentPage > numUncategorizedTransactions / perPageNum) {
            setCurrentPage(
              Math.floor(numUncategorizedTransactions / perPageNum)
            );
          }
        }}
      >
        {perPageNum}
      </a>
    );
  }

  return (
    <>
      <AccountCardContainer
        activeAccountChangeCallback={() => setCurrentPage(0)}
      />

      <div className='categorize-table-controls'>
        <div
          className={
            ' num-transactions-option selected-transactions-space ' +
            (selectedTransactions.length ? 'unhide' : 'hide')
          }
          style={{ marginRight: 'auto' }}
        >
          <p>
            You have <b className='alert'>{selectedTransactions.length}</b>{' '}
            currently selected transaction{''}
            {selectedTransactions.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className='num-transactions-option'>
          <p>Transactions per page:</p>{' '}
          {[25, 50, 100].map((val) => transactionsPerPageLink(val))}
        </div>

        <div
          className='search-categorize-txns-container'
          style={{
            textAlign: 'left',
            padding: '.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <Search />
          <TextField
            type={'search'}
            inputProps={{ className: 'search-categorize-txns' }}
            label={'Search Transactions'}
            size={'small'}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setSearchInput((event.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        <ButtonWithToolTip
          onClick={() => {
            if (
              selectedTransactions.filter(
                (transaction) =>
                  transaction.debit_account_id === activeAccount.id ||
                  transaction.credit_account_id === activeAccount.id
              ).length !== 0
            ) {
              setShowBulkActionModal(true);
            } else {
              return toast.warning(
                'Bulk actions require at least 1 transaction to be selected.'
              );
            }
          }}
          toolTipContent='Bulk Actions'
          className='bulk-actions-btn'
        >
          <RiCheckboxMultipleFill />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={() => setShowAddNewTxn(true)}
          toolTipContent='Add Transaction'
          className='add-trxns-btn'
        >
          <FiPlusCircle />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={() => setShowUploadTxnModal(true)}
          toolTipContent='Upload Transactions'
          className='upload-trxns-btn'
        >
          <BiUpload />
        </ButtonWithToolTip>

        <ButtonWithToolTip
          onClick={refreshTransactions}
          toolTipContent='Refresh'
          className='resfresh-trxns-btn'
        >
          <IoMdRefresh className='refresh-icon' />
        </ButtonWithToolTip>
      </div>

      <CategorizeList
        account={activeAccount}
        showAddNewTxn={showaddNewTxn}
        setShowAddNewTxn={setShowAddNewTxn}
        setSelectedTransactions={setSelectedTransactions}
        addSelectedTransaction={addSelectedTransaction}
        removeSelectedTransaction={removeSelectedTransaction}
        startingPosition={currentPage * numTransactionsToDisplay}
        numTransactionsToDisplay={numTransactionsToDisplay}
        searchFunc={(transaction: Transaction) => {
          const searchText: string = searchInput.toLocaleLowerCase();
          return (
            transaction.name.toLocaleLowerCase().includes(searchText) ||
            transaction.description.toLocaleLowerCase().includes(searchText)
          );
        }}
      />

      {pages.length ? (
        <p className='transactions-page'>
          Page{' '}
          {pages.map((val) => (
            <a
              key={val}
              onClick={() => setCurrentPage(val)}
              className={val === currentPage ? 'active-txn-page' : ''}
            >
              {val + 1}
            </a>
          ))}{' '}
        </p>
      ) : (
        ''
      )}

      <UploadTxnModal
        isOpen={showUploadTxnModal}
        onRequestClose={() => {
          setShowUploadTxnModal(false);
        }}
      />

      <BulkActionModal
        isOpen={showBulkActionModal}
        onRequestClose={() => {
          setShowBulkActionModal(false);
        }}
        selectedTransactions={selectedTransactions}
        removeSelectedTransactions={(deselectTransactions: Transaction[]) => {
          const deselectIds: number[] = deselectTransactions.map(
            (txn: Transaction) => txn.id
          );
          setSelectedTransactions((prev: Transaction[]) =>
            prev.filter((txn: Transaction) => !deselectIds.includes(txn.id))
          );
        }}
      />
    </>
  );
}

export default CategorizeTransactionsPage;
