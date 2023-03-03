import React from 'react';
import { act, screen } from '@testing-library/react';
import { AccountCard } from '../../features/Accounts';
import Account from '../../features/Accounts/types/types';
import {
  setTransactions,
  categorizeTransaction,
  categorizeManyTransactions,
} from '../../features/Transactions/stores/transactionSlice';
import { setupStore } from '../../stores/store';
import { renderWithProviders } from '../setupTests';

const testAccount: Account = {
  id: 1,
  name: 'Testing Account',
  account_type_id: 1,
  account_type: 'Test Accounts',
  debit_inc: 1,
  balance: -10.0,
  last_updated: '2022-02-22',
};

describe('AccountCard Component', () => {
  it('Renders the Account Card without Error', async () => {
    renderWithProviders(
      <AccountCard accountData={testAccount} onClick={() => null} />
    );
  });

  it('Displays the account name', async () => {
    renderWithProviders(
      <AccountCard accountData={testAccount} onClick={() => null} />
    );

    expect(await screen.findByText(testAccount.name)).toBeDefined();
  });

  it('Displays the account type group', async () => {
    renderWithProviders(
      <AccountCard accountData={testAccount} onClick={() => null} />
    );

    expect(await screen.findByText(testAccount.account_type)).toBeDefined();
  });

  describe('Balance Display', () => {
    it('Rounds dispalyed balance to 2 decimal places', async () => {
      renderWithProviders(
        <AccountCard accountData={testAccount} onClick={() => null} />
      );

      expect(await screen.findByText('-$10.00')).toBeDefined();
    });

    it('Adds negative class to negative balances', async () => {
      renderWithProviders(
        <AccountCard accountData={testAccount} onClick={() => null} />
      );

      const balance = await screen.findByText('-$10.00');

      expect(balance.classList).toContain('negative');
    });

    it('Adds positive class to positive balances', async () => {
      renderWithProviders(
        <AccountCard
          accountData={{ ...testAccount, balance: 10.0 }}
          onClick={() => null}
        />
      );

      const balance = await screen.findByText('$10.00');

      expect(balance.classList).toContain('positive');
    });
  });

  describe('Uncategorized display', () => {
    it('Displays a muted 0 if there are no uncategorized transactions', async () => {
      renderWithProviders(
        <AccountCard
          accountData={{ ...testAccount, balance: 10.0 }}
          onClick={() => null}
        />
      );

      const uncategorizedTransactions = await screen.findByText('0');

      expect(uncategorizedTransactions).toBeDefined();
      expect(uncategorizedTransactions.classList).toContain(
        'account-uncategorized-transactions'
      );
      expect(uncategorizedTransactions.classList).toContain('muted');
    });

    it('Displays an alerted 1 if there is one uncategorized transaction', async () => {
      const testStore = setupStore();

      testStore.dispatch(
        setTransactions({
          transactions: [
            {
              id: 1,
              name: 'Test Transcation',
              description: 'This transaction is only a test',
              amount: -10.99,
              debit_account_id: 1,
              credit_account_id: 'undefined',
              transaction_date: '2022-02-22',
              date_entered: '2022-02-22',
            },
          ],
        })
      );

      renderWithProviders(
        <AccountCard
          accountData={{ ...testAccount, balance: 10.0 }}
          onClick={() => null}
        />,
        { store: testStore }
      );

      const uncategorizedTransactions = await screen.findByText('1');

      expect(uncategorizedTransactions).toBeDefined();
      expect(uncategorizedTransactions.classList).toContain(
        'account-uncategorized-transactions'
      );
      expect(uncategorizedTransactions.classList).toContain(
        'uncategorized-alert'
      );
    });

    it('Updates with categorizeTransaction action', async () => {
      const testStore = setupStore();

      testStore.dispatch(
        setTransactions({
          transactions: [
            {
              id: 1,
              name: 'Test Transcation',
              description: 'This transaction is only a test',
              amount: -10.99,
              debit_account_id: 1,
              credit_account_id: 'undefined',
              transaction_date: '2022-02-22',
              date_entered: '2022-02-22',
            },
          ],
        })
      );

      renderWithProviders(
        <AccountCard
          accountData={{ ...testAccount, balance: 10.0 }}
          onClick={() => null}
        />,
        { store: testStore }
      );

      let uncategorizedTransactions = await screen.findByText('1');

      expect(uncategorizedTransactions).toBeDefined();

      act(() => {
        testStore.dispatch(
          categorizeTransaction({
            accountID: 1,
            transactionID: 1,
            categoryID: 2,
            debitOrCredit: 'credit',
          })
        );
      });

      uncategorizedTransactions = await screen.findByText('0');

      expect(uncategorizedTransactions).toBeDefined();
      expect(uncategorizedTransactions.classList).toContain('muted');
    });

    it('Updates with categorizeManyTransactions action', async () => {
      const testStore = setupStore();

      testStore.dispatch(
        setTransactions({
          transactions: [
            {
              id: 1,
              name: 'Test Transcation',
              description: 'This transaction is only a test',
              amount: -10.99,
              debit_account_id: 1,
              credit_account_id: 'undefined',
              transaction_date: '2022-02-22',
              date_entered: '2022-02-22',
            },
            {
              id: 2,
              name: 'Test Transcation2',
              description: 'This transaction is only a test',
              amount: -10.99,
              debit_account_id: 'undefined',
              credit_account_id: 1,
              transaction_date: '2022-02-22',
              date_entered: '2022-02-22',
            },
            {
              id: 3,
              name: 'Test Transcation 3',
              description: 'This transaction is only a test',
              amount: -10.99,
              debit_account_id: 'undefined',
              credit_account_id: 1,
              transaction_date: '2022-02-22',
              date_entered: '2022-02-22',
            },
          ],
        })
      );

      renderWithProviders(
        <AccountCard
          accountData={{ ...testAccount, balance: 10.0 }}
          onClick={() => null}
        />,
        { store: testStore }
      );

      let uncategorizedTransactions = await screen.findByText('3');

      expect(uncategorizedTransactions).toBeDefined();

      act(() => {
        testStore.dispatch(
          categorizeManyTransactions({
            accountID: 1,
            transactionInfo: [
              {
                id: 1,
                debitOrCredit: 'credit',
              },
              {
                id: 2,
                debitOrCredit: 'debit',
              },
            ],
            categoryID: 2,
          })
        );
      });

      uncategorizedTransactions = await screen.findByText('1');

      expect(uncategorizedTransactions).toBeDefined();
    });
  });
});
