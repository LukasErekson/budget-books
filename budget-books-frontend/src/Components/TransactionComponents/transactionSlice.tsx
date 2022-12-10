import { createSlice } from '@reduxjs/toolkit';

const initialTransactionList: any = {};

export const transactionSlice: any = createSlice({
  name: 'transactions',
  initialState: {
    transactionList: initialTransactionList,
    isTransactionsLoaded: false,
  },
  reducers: {
    setTransactions: (state, action) => {
      const transactions: any[] = action.payload.transactions;

      // Deep copy of the state's transactions
      let stateTransactions: any = JSON.parse(
        JSON.stringify(state.transactionList)
      );

      for (let trxn of transactions) {
        const debitAcctId: string = trxn.debit_account_id;
        const creditAcctId: string = trxn.credit_account_id;

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
            .map((transaction: any) => transaction.id)
            .includes(trxn.id)
        ) {
          stateTransactions[debitAcctId].push(trxn);
        }

        if (
          creditAcctId &&
          creditAcctId !== 'undefined' &&
          !stateTransactions[creditAcctId]
            .map((transaction: any) => transaction.id)
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
      const accountID = action.payload.accountID;
      const transactionID = action.payload.transactionID;
      const categoryID = action.payload.categoryID;
      const debitOrCredit = action.payload.debitOrCredit;

      // Deep copy of the state's transactions
      let stateTransactions: any = JSON.parse(
        JSON.stringify(state.transactionList)
      );

      let indexOfTransaction = stateTransactions[accountID]
        .map((trxn: any) => trxn.id)
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
  },
});

export const {
  setTransactions,
  setTransactionsIsLoaded,
  categorizeTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
