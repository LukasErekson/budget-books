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
import { mockThunkReturn } from '../../setupTests';
import Account from '../../../features/Accounts/types/types';
import * as BadResponseError from '../../../utils/BadResponseError';

describe('Account Thunks', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');
  const BadResponseMock = jest.spyOn(BadResponseError, 'default');

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
            accounts: JSON.stringify(fakeAccounts),
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
      it("Doesn't dispatch loadAccounts", async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
              json: () =>
                JSON.stringify({
                  accounts: fakeAccounts,
                }),
            });
          }),
          cancel: () => null,
        });
        await dispatch(fetchAccounts());

        expect(loadAccounts).not.toHaveBeenCalled();
      });

      it('Throws a BadResponseError', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, reject) => {
            resolve({
              ok: false,
              json: () =>
                JSON.stringify({
                  accounts: fakeAccounts,
                }),
            });
          }),
          cancel: () => null,
        });

        await dispatch(fetchAccounts());

        expect(BadResponseMock).toHaveBeenCalled();
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
      it('Throws a BadResponseError', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: false,
              json: () => ({
                message: 'Something went wrong',
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

        expect(BadResponseMock).toHaveBeenCalled();
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
                1: 2000.0,
                34: 2000,
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

    describe('Given a bad resposne', () => {
      it('Throws a BadResponseError', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve, _) => {
            resolve({
              ok: false,
              json: () => ({
                message: 'Something went wrong',
              }),
            });
          }),
          cancel: () => null,
        });

        await dispatch(fetchAccountBalances([1, 34]));

        expect(BadResponseMock).toHaveBeenCalled();
      });
    });
  });
});
