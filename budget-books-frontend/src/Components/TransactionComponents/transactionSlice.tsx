import { createSlice } from '@reduxjs/toolkit';
import Transaction from './transactionTSTypes';

const initialTransactionList: { [accountID: number]: Transaction[] } = {};

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactionList: initialTransactionList,
    isTransactionsLoaded: false,
  },
  reducers: {
    setTransactions: (state, action) => {
      const transactions: Transaction[] = action.payload.transactions;

      // Deep copy of the state's transactions
      let stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      for (let trxn of transactions) {
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
      let stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      let indexOfTransaction = stateTransactions[accountID]
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
    deleteTransaction: (state, action) => {
      const {
        idsToDelete,
        changedAccountIds,
      }: { idsToDelete: number[]; changedAccountIds: number[] } =
        action.payload;

      // Deep copy of the state's transactions
      let stateTransactions: { [id: number | string]: Transaction[] } =
        JSON.parse(JSON.stringify(state.transactionList));

      for (let accountID of changedAccountIds) {
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
  },
});

export const {
  setTransactions,
  setTransactionsIsLoaded,
  categorizeTransaction,
  deleteTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
