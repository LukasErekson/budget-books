import {
  fetchAccounts,
  addNewAccount,
  fetchAccountBalances,
} from '../../../features/Accounts/stores/accountThunks';

import * as AccountThunks from '../../../features/Accounts/stores/accountThunks';
import * as AccountTypeThunks from '../../../features/AccountTypes/stores/accountTypeThunks';
import { setupStore } from '../../../stores/store';
import * as AccountActions from '../../../features/Accounts/stores/accountSlice';
import * as DataFetch from '../../../utils/DataFetch';

import Account from '../../../features/Accounts/types/types';
import BadResponseError from '../../../utils/BadResponseError';
jest.mock('../../../utils/BadResponseError');

describe('Account Thunks', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');

  const mockStore = setupStore();
  const dispatch = mockStore.dispatch;

  const fakeAccounts: Account[] = [
    {
      id: 1,
      name: 'Account 1',
      account_type_id: 1,
      account_type: 'Test',
      debit_inc: true,
      balance: 0.0,
      last_updated: '01/01/2023',
    },
    {
      id: 2,
      name: 'Account 22',
      account_type_id: 1,
      account_type: 'Test',
      debit_inc: true,
      balance: 0.0,
      last_updated: '01/01/2023',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAccounts', () => {
    const dataFetchReturn = {
      responsePromise: new Promise<any>((resolve, reject) => {
        resolve({
          ok: true,
          json: () => ({
            message: 'SUCCESS',
            accounts: fakeAccounts,
          }),
        });
      }),
      cancel: () => null,
    };

    const loadAccounts = jest.spyOn(AccountActions, 'loadAccounts');

    beforeEach(() => {
      DataFetchMock.mockReturnValue(dataFetchReturn);
    });

    it('Defaults account_type to "all"', async () => {
      await dispatch(fetchAccounts());

      expect(DataFetchMock).toHaveBeenCalledWith(
        'GET',
        '/api/accounts?account_type=all'
      );
    });

    describe('Given an ok response', () => {
      it('Dispatches loadAccounts', async () => {
        await dispatch(fetchAccounts());

        expect(loadAccounts).toHaveBeenCalledWith(fakeAccounts);
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError with a message if available', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: true,
              status: 400,
              json: () => ({
                message: 'FAILURE',
                serverError: 'Exception finding account in ACCOUNTS.',
              }),
            });
          }),
          cancel: () => null,
        });
        await dispatch(fetchAccounts());

        expect(BadResponseError).toHaveBeenCalledWith(
          400,
          'FAILURE',
          'Exception finding account in ACCOUNTS.'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
              status: 500,
            });
          }),
          cancel: () => null,
        });

        await dispatch(fetchAccounts());

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
    });
  });

  describe('addNewAccount', () => {
    describe('Given an ok response', () => {
      beforeEach(() => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'SUCCESS',
                account_name: 'My New Account',
                account_id: '3',
              }),
            });
          }),
          cancel: () => null,
        });
      });

      it('Dispatches fetchAccounts and fetchAccountTypes', async () => {
        const fetchAccountsMock = jest.spyOn(AccountThunks, 'fetchAccounts');

        const fetchAccountTypesMock = jest.spyOn(
          AccountTypeThunks,
          'fetchAccountTypes'
        );

        await dispatch(
          addNewAccount(
            'My New Account',
            { label: 'Misc. Accounts', value: 1 },
            true
          )
        );

        expect(fetchAccountsMock).toHaveBeenCalled();
        expect(fetchAccountTypesMock).toHaveBeenCalled();
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError with message if given', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: false,
              status: 500,
              json: () => ({
                message: 'FAILURE',
                serverError: 'Exception raised in backend',
              }),
            });
          }),
          cancel: () => null,
        });

        await dispatch(
          addNewAccount(
            'My New Account',
            { label: 'Misc. Accounts', value: 1 },
            true
          )
        );

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: false,
              status: 500,
            });
          }),
          cancel: () => null,
        });

        await dispatch(
          addNewAccount(
            'My New Account',
            { label: 'Misc. Accounts', value: 1 },
            true
          )
        );

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
    });
  });

  describe('fetchAccountBalances', () => {
    describe('Given an ok response', () => {
      beforeEach(() => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'SUCCESS',
                balances: {
                  1: 2000.0,
                  34: 2000,
                },
              }),
            });
          }),
          cancel: () => null,
        });
      });
      it('Dispatches updateAccountBalances', async () => {
        const updateAccountBalancesMock = jest.spyOn(
          AccountActions,
          'updateAccountBalances'
        );

        await dispatch(fetchAccountBalances([1, 34]));

        expect(updateAccountBalancesMock).toHaveBeenCalled();
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError when ok is false', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: true,
              status: 400,
              json: () => ({
                message: 'FAILURE',
                serverError: 'Account with ID 34 not found.',
              }),
            });
          }),
          cancel: () => null,
        });

        await dispatch(fetchAccountBalances([1, 34]));

        expect(BadResponseError).toHaveBeenCalledWith(
          400,
          'FAILURE',
          'Account with ID 34 not found.'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: false,
              status: 500,
            });
          }),
          cancel: () => null,
        });

        await dispatch(fetchAccountBalances([1, 34]));

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
    });
  });
});
