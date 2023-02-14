import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { AccountCard } from '../features/Accounts';
import Account from '../features/Accounts/types/types';
import store from '../stores/store';
import * as transactionSelectors from '../features/Transactions/stores/transactionSelectors';
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
    render(
      <Provider store={store}>
        <AccountCard accountData={testAccount} onClick={() => {}} />
      </Provider>
    );
  });

  it('Displays the account name', async () => {
    render(
      <Provider store={store}>
        <AccountCard accountData={testAccount} onClick={() => {}} />
      </Provider>
    );

    expect(await screen.findByText(testAccount.name)).toBeDefined();
  });

  it('Displays the account type group', async () => {
    render(
      <Provider store={store}>
        <AccountCard accountData={testAccount} onClick={() => {}} />
      </Provider>
    );

    expect(await screen.findByText(testAccount.account_type)).toBeDefined();
  });

  describe('Balance Display', () => {
    it('Rounds dispalyed balance to 2 decimal places', async () => {
      render(
        <Provider store={store}>
          <AccountCard accountData={testAccount} onClick={() => {}} />
        </Provider>
      );

      expect(await screen.findByText('-$10.00')).toBeDefined();
    });

    it('Adds negative class to negative balances', async () => {
      render(
        <Provider store={store}>
          <AccountCard accountData={testAccount} onClick={() => {}} />
        </Provider>
      );

      let balance = await screen.findByText('-$10.00');

      expect(balance.classList).toContain('negative');
    });

    it('Adds positive class to positive balances', async () => {
      render(
        <Provider store={store}>
          <AccountCard
            accountData={{ ...testAccount, balance: 10.0 }}
            onClick={() => {}}
          />
        </Provider>
      );

      let balance = await screen.findByText('$10.00');

      expect(balance.classList).toContain('positive');
    });
  });

  describe('Uncategorized display', () => {
    it('Displays a muted 0 if there are no uncategorized transactions', async () => {
      render(
        <Provider store={store}>
          <AccountCard
            accountData={{ ...testAccount, balance: 10.0 }}
            onClick={() => {}}
          />
        </Provider>
      );

      let uncategorizedTransactions = await screen.findByText('0');

      expect(uncategorizedTransactions).toBeDefined();
      expect(uncategorizedTransactions.classList).toContain(
        'account-uncategorized-transactions'
      );
      expect(uncategorizedTransactions.classList).toContain('muted');
    });

    it('Displays an alerted 1 if there is one uncategorized transaction', async () => {
      let uncategorizedSpy = jest.spyOn(
        transactionSelectors,
        'selectUncategorizedTransactions'
      );

      uncategorizedSpy.mockReturnValue([
        {
          id: 1,
          name: 'Test Transcation',
          description: 'This transaction is only a test',
          amount: -10.99,
          debit_account_id: 1,
          credit_account_id: 0,
          transaction_date: '2022-02-22',
          date_entered: '2022-02-22',
        },
      ]);

      render(
        <Provider store={store}>
          <AccountCard
            accountData={{ ...testAccount, balance: 10.0 }}
            onClick={() => {}}
          />
        </Provider>
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
