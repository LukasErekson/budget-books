import { screen } from '@testing-library/react';
import { AccountCard } from '../features/Accounts';
import Account from '../features/Accounts/types/types';
import * as transactionSelectors from '../features/Transactions/stores/transactionSelectors';
import { setTransactions } from '../features/Transactions/stores/transactionSlice';
import { setupStore } from '../stores/store';
import { renderWithProviders } from './setupTests';

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
      <AccountCard accountData={testAccount} onClick={() => {}} />
    );
  });

  it('Displays the account name', async () => {
    renderWithProviders(
      <AccountCard accountData={testAccount} onClick={() => {}} />
    );

    expect(await screen.findByText(testAccount.name)).toBeDefined();
  });

  it('Displays the account type group', async () => {
    renderWithProviders(
      <AccountCard accountData={testAccount} onClick={() => {}} />
    );

    expect(await screen.findByText(testAccount.account_type)).toBeDefined();
  });

  describe('Balance Display', () => {
    it('Rounds dispalyed balance to 2 decimal places', async () => {
      renderWithProviders(
        <AccountCard accountData={testAccount} onClick={() => {}} />
      );

      expect(await screen.findByText('-$10.00')).toBeDefined();
    });

    it('Adds negative class to negative balances', async () => {
      renderWithProviders(
        <AccountCard accountData={testAccount} onClick={() => {}} />
      );

      let balance = await screen.findByText('-$10.00');

      expect(balance.classList).toContain('negative');
    });

    it('Adds positive class to positive balances', async () => {
      renderWithProviders(
        <AccountCard
          accountData={{ ...testAccount, balance: 10.0 }}
          onClick={() => {}}
        />
      );

      let balance = await screen.findByText('$10.00');

      expect(balance.classList).toContain('positive');
    });
  });

  describe('Uncategorized display', () => {
    it('Displays a muted 0 if there are no uncategorized transactions', async () => {
      renderWithProviders(
        <AccountCard
          accountData={{ ...testAccount, balance: 10.0 }}
          onClick={() => {}}
        />
      );

      let uncategorizedTransactions = await screen.findByText('0');

      expect(uncategorizedTransactions).toBeDefined();
      expect(uncategorizedTransactions.classList).toContain(
        'account-uncategorized-transactions'
      );
      expect(uncategorizedTransactions.classList).toContain('muted');
    });

    it('Displays an alerted 1 if there is one uncategorized transaction', async () => {
      const testStore = setupStore();

      const dispatch = testStore.dispatch;

      dispatch(
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
          onClick={() => {}}
        />,
        { store: testStore }
      );

      let uncategorizedTransactions = await screen.findByText('1');

      expect(uncategorizedTransactions).toBeDefined();
      expect(uncategorizedTransactions.classList).toContain(
        'account-uncategorized-transactions'
      );
      expect(uncategorizedTransactions.classList).toContain(
        'uncategorized-alert'
      );
    });
  });
});