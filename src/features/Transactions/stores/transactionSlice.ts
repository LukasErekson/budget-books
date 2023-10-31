import { createSlice } from '@reduxjs/toolkit';
import Transaction from '../types/types';

const initialTransactionList: { [accountID: number]: Transaction[] } = {};

const initialSelectedTransactions: Transaction[] = [];

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactionList: initialTransactionList,
    isTransactionsLoaded: false,
    selectedTransactions: initialSelectedTransactions,
  },
  reducers: {
    setTransactions: (state, action) => {
      const transactions: Transaction[] = action.payload.transactions;

      // Deep copy of the state's transactions
      const stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      for (const trxn of transactions) {
        const debitAcctId: number | string = trxn.debit_account_id;
        const creditAcctId: number | string = trxn.credit_account_id;

        if (!(debitAcctId in stateTransactions)) {
          stateTransactions[debitAcctId] = [];
        }

        if (!(creditAcctId in stateTransactions)) {
          stateTransactions[creditAcctId] = [];
        }

        if (
          debitAcctId &&
          debitAcctId !== 'undefined' &&
          !stateTransactions[debitAcctId]
            .map((transaction: Transaction) => transaction.id)
            .includes(trxn.id)
        ) {
          stateTransactions[debitAcctId].push(trxn);
        }

        if (
          creditAcctId &&
          creditAcctId !== 'undefined' &&
          !stateTransactions[creditAcctId]
            .map((transaction: Transaction) => transaction.id)
            .includes(trxn.id)
        ) {
          stateTransactions[creditAcctId].push(trxn);
        }
      }

      return { ...state, transactionList: stateTransactions };
    },

    setTransactionsIsLoaded: (state, action) => {
      const loaded: boolean = action.payload.loaded;

      return { ...state, isTransactionsLoaded: loaded };
    },

    categorizeTransaction: (state, action) => {
      const accountID: number = action.payload.accountID;
      const transactionID: number = action.payload.transactionID;
      const categoryID: number = action.payload.categoryID;
      const debitOrCredit: string = action.payload.debitOrCredit;

      // Deep copy of the state's transactions
      const stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      const indexOfTransaction = stateTransactions[accountID]
        .map((trxn: Transaction) => trxn.id)
        .indexOf(transactionID);

      stateTransactions[accountID][indexOfTransaction][
        debitOrCredit === 'credit' ? 'credit_account_id' : 'debit_account_id'
      ] = categoryID;

      return {
        ...state,
        transactionList: stateTransactions,
        isTransactionsLoaded: true,
      };
    },

    categorizeManyTransactions: (state, action) => {
      const accountID: number = action.payload.accountID;
      const transactionInfo: { id: number; debitOrCredit: string }[] =
        action.payload.transactionInfo;
      const categoryID: number = action.payload.categoryID;

      // Deep copy of the state's transactions
      const stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      transactionInfo.forEach((tInfo) => {
        const indexOfTransaction = stateTransactions[accountID]
          .map((trxn: Transaction) => trxn.id)
          .indexOf(tInfo.id);

        stateTransactions[accountID][indexOfTransaction][
          tInfo.debitOrCredit === 'credit'
            ? 'credit_account_id'
            : 'debit_account_id'
        ] = categoryID;
      });

      return {
        ...state,
        transactionList: stateTransactions,
        isTransactionsLoaded: true,
      };
    },

    editSingleTransaction: (state, action) => {
      const editTransaction: Transaction = action.payload.transaction;
      const changedAccountIds: number[] = action.payload.changedAccountIds;

      // Deep copy of the state's transactions
      const stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      changedAccountIds.forEach((accountID: number) => {
        const indexOfTransaction = stateTransactions[accountID]
          .map((trxn: Transaction) => trxn.id)
          .indexOf(editTransaction.id);

        stateTransactions[accountID][indexOfTransaction] = editTransaction;
      });

      return {
        ...state,
        transactionList: stateTransactions,
        isTransactionsLoaded: true,
      };
    },

    deleteTransaction: (state, action) => {
      const {
        idsToDelete,
        changedAccountIds,
      }: { idsToDelete: number[]; changedAccountIds: number[] } =
        action.payload;

      // Deep copy of the state's transactions
      const stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      for (const accountID of changedAccountIds) {
        stateTransactions[accountID] = stateTransactions[accountID].filter(
          (txn: Transaction) => !idsToDelete.includes(txn.id)
        );
      }

      return {
        ...state,
        transactionList: stateTransactions,
        isTransactionsLoaded: true,
      };
    },

    selectTransactions: (state, action) => {
      const selectedTransactions: Transaction[] = action.payload;

      return { ...state, selectedTransactions: selectedTransactions };
    },

    deSelectTransactions: (state, action) => {
      const deSelectedTransactions: Transaction[] = action.payload;
      const deSelectIDs: number[] = deSelectedTransactions.map(
        (txn: Transaction) => txn.id
      );

      const newSelectedTransactions: Transaction[] =
        state.selectedTransactions.filter(
          (trxn: Transaction) => !deSelectIDs.includes(trxn.id)
        );

      return { ...state, selectedTransactions: newSelectedTransactions };
    },
  },
});

export const {
  setTransactions,
  setTransactionsIsLoaded,
  categorizeTransaction,
  categorizeManyTransactions,
  editSingleTransaction,
  deleteTransaction,
  selectTransactions,
  deSelectTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
