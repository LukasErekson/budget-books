import Transaction from '../../../features/Transactions/types/types';

import transactionSlice, {
  setTransactions,
  setTransactionsIsLoaded,
  categorizeTransaction,
  categorizeManyTransactions,
  deleteTransaction,
} from '../../../features/Transactions/stores/transactionSlice';

describe('transactionSlice Reducers', () => {
  describe('setTransactions', () => {
    it('Properly sets transaction list with debits and credits', () => {
      const newTransactions: Transaction[] = [
        {
          id: 1,
          name: 'Jesting Supplies',
          description: 'Jesting supplies for all your testing needs!',
          amount: 30.25,
          debit_account_id: 1,
          credit_account_id: 'undefined',
          transaction_date: '03/20/2023',
          date_entered: '04/13/2023',
        },
      ];

      const { payload, type } = setTransactions({
        transactions: newTransactions,
      });

      expect(payload).toEqual({
        transactions: newTransactions,
      });
      expect(type).toEqual('transactions/setTransactions');

      const newState = transactionSlice(
        { transactionList: {}, isTransactionsLoaded: false },
        { payload, type }
      );

      expect(newState).toEqual({
        isTransactionsLoaded: false,
        transactionList: {
          '1': [newTransactions[0]],
          undefined: [],
        },
      });
    });
  });

  describe('setTransactionsIsLoaded', () => {
    it('Updates isTransactionsLoaded state from false to true', () => {
      const { payload, type } = setTransactionsIsLoaded({ loaded: true });

      expect(payload).toEqual({
        loaded: true,
      });

      expect(type).toEqual('transactions/setTransactionsIsLoaded');

      const newState = transactionSlice(
        { transactionList: {}, isTransactionsLoaded: false },
        { payload, type }
      );

      expect(newState).toEqual({
        isTransactionsLoaded: true,
        transactionList: {},
      });
    });

    it('Updates isTransactionsLoaded state from true to false', () => {
      const { payload, type } = setTransactionsIsLoaded({ loaded: false });

      expect(payload).toEqual({
        loaded: false,
      });

      expect(type).toEqual('transactions/setTransactionsIsLoaded');

      const newState = transactionSlice(
        { transactionList: {}, isTransactionsLoaded: true },
        { payload, type }
      );

      expect(newState).toEqual({
        isTransactionsLoaded: false,
        transactionList: {},
      });
    });
  });

  describe('categorizeTransaction', () => {
    it('Properly updates the state by modifying a single transaction', () => {
      const payload = {
        accountID: 1,
        transactionID: 1,
        categoryID: 2,
        debitOrCredit: 'credit',
      };

      const prevState = {
        isTransactionsLoaded: true,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 'undefined',
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      };

      const { type } = categorizeTransaction(payload);

      expect(type).toEqual('transactions/categorizeTransaction');

      const newState = transactionSlice(prevState, { payload, type });

      expect(newState).toEqual({
        isTransactionsLoaded: true,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 2,
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      });
    });
    it('Properly updates the state by setting isTransactionsLoaded to true', () => {
      const payload = {
        accountID: 1,
        transactionID: 1,
        categoryID: 2,
        debitOrCredit: 'credit',
      };

      const prevState = {
        isTransactionsLoaded: false,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 'undefined',
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      };

      const { type } = categorizeTransaction(payload);

      expect(type).toEqual('transactions/categorizeTransaction');

      const newState = transactionSlice(prevState, { payload, type });

      expect(newState).toEqual({
        isTransactionsLoaded: true,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 2,
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      });
    });
  });

  describe('categorizeManyTransactions', () => {
    it('Properly updates multiple transactions', () => {
      const payload = {
        accountID: 1,
        transactionInfo: [
          { id: 1, debitOrCredit: 'credit' },
          { id: 3, debitOrCredit: 'debit' },
        ],
        categoryID: 2,
      };

      const prevState = {
        isTransactionsLoaded: false,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 'undefined',
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
            {
              id: 3,
              name: 'Credit card payment',
              description: 'Credit Card Payment',
              amount: 30.25,
              debit_account_id: 'undefined',
              credit_account_id: 1,
              transaction_date: '03/22/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      };

      const { type } = categorizeManyTransactions(payload);

      expect(type).toEqual('transactions/categorizeManyTransactions');

      const newState = transactionSlice(prevState, { payload, type });

      expect(newState).toEqual({
        isTransactionsLoaded: true,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 2,
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
            {
              id: 3,
              name: 'Credit card payment',
              description: 'Credit Card Payment',
              amount: 30.25,
              debit_account_id: 2,
              credit_account_id: 1,
              transaction_date: '03/22/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      });
    });
  });

  describe('deleteTransaction', () => {
    describe('Deleting from one account', () => {
      it('Removes one transaction from state', () => {
        const payload = {
          idsToDelete: [1],
          changedAccountIds: [1],
        };

        const prevState = {
          isTransactionsLoaded: false,
          transactionList: {
            1: [
              {
                id: 1,
                name: 'Jesting Supplies',
                description: 'Jesting supplies for all your testing needs!',
                amount: 30.25,
                debit_account_id: 1,
                credit_account_id: 'undefined',
                transaction_date: '03/20/2023',
                date_entered: '04/13/2023',
              },
              {
                id: 3,
                name: 'Credit card payment',
                description: 'Credit Card Payment',
                amount: 30.25,
                debit_account_id: 'undefined',
                credit_account_id: 1,
                transaction_date: '03/22/2023',
                date_entered: '04/13/2023',
              },
            ],
          },
        };

        const { type } = deleteTransaction(payload);

        const newState = transactionSlice(prevState, { payload, type });

        expect(newState).toEqual({
          isTransactionsLoaded: true,
          transactionList: {
            1: [
              {
                id: 3,
                name: 'Credit card payment',
                description: 'Credit Card Payment',
                amount: 30.25,
                debit_account_id: 'undefined',
                credit_account_id: 1,
                transaction_date: '03/22/2023',
                date_entered: '04/13/2023',
              },
            ],
          },
        });
      });
      it('Removes multiple transaction from state', () => {
        const payload = {
          idsToDelete: [1, 3],
          changedAccountIds: [1],
        };

        const prevState = {
          isTransactionsLoaded: false,
          transactionList: {
            1: [
              {
                id: 1,
                name: 'Jesting Supplies',
                description: 'Jesting supplies for all your testing needs!',
                amount: 30.25,
                debit_account_id: 1,
                credit_account_id: 'undefined',
                transaction_date: '03/20/2023',
                date_entered: '04/13/2023',
              },
              {
                id: 3,
                name: 'Credit card payment',
                description: 'Credit Card Payment',
                amount: 30.25,
                debit_account_id: 'undefined',
                credit_account_id: 1,
                transaction_date: '03/22/2023',
                date_entered: '04/13/2023',
              },
            ],
          },
        };

        const { type } = deleteTransaction(payload);

        const newState = transactionSlice(prevState, { payload, type });

        expect(newState).toEqual({
          isTransactionsLoaded: true,
          transactionList: {
            1: [],
          },
        });
      });
    });
  });
  describe('Deleting from two accounts', () => {
    it('Removes one transaction from state', () => {
      const payload = {
        idsToDelete: [1],
        changedAccountIds: [1, 2],
      };

      const prevState = {
        isTransactionsLoaded: false,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 2,
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
            {
              id: 3,
              name: 'Credit card payment',
              description: 'Credit Card Payment',
              amount: 30.25,
              debit_account_id: 'undefined',
              credit_account_id: 1,
              transaction_date: '03/22/2023',
              date_entered: '04/13/2023',
            },
          ],
          2: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 2,
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      };

      const { type } = deleteTransaction(payload);

      const newState = transactionSlice(prevState, { payload, type });

      expect(newState).toEqual({
        isTransactionsLoaded: true,
        transactionList: {
          1: [
            {
              id: 3,
              name: 'Credit card payment',
              description: 'Credit Card Payment',
              amount: 30.25,
              debit_account_id: 'undefined',
              credit_account_id: 1,
              transaction_date: '03/22/2023',
              date_entered: '04/13/2023',
            },
          ],
          2: [],
        },
      });
    });
    it('Removes multiple transaction from state', () => {
      const payload = {
        idsToDelete: [1, 3],
        changedAccountIds: [1, 2],
      };

      const prevState = {
        isTransactionsLoaded: false,
        transactionList: {
          1: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 2,
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
            {
              id: 3,
              name: 'Credit card payment',
              description: 'Credit Card Payment',
              amount: 30.25,
              debit_account_id: 2,
              credit_account_id: 1,
              transaction_date: '03/22/2023',
              date_entered: '04/13/2023',
            },
          ],
          2: [
            {
              id: 1,
              name: 'Jesting Supplies',
              description: 'Jesting supplies for all your testing needs!',
              amount: 30.25,
              debit_account_id: 1,
              credit_account_id: 2,
              transaction_date: '03/20/2023',
              date_entered: '04/13/2023',
            },
            {
              id: 3,
              name: 'Credit card payment',
              description: 'Credit Card Payment',
              amount: 30.25,
              debit_account_id: 2,
              credit_account_id: 1,
              transaction_date: '03/22/2023',
              date_entered: '04/13/2023',
            },
          ],
        },
      };

      const { type } = deleteTransaction(payload);

      const newState = transactionSlice(prevState, { payload, type });

      expect(newState).toEqual({
        isTransactionsLoaded: true,
        transactionList: {
          1: [],
          2: [],
        },
      });
    });
  });
});
