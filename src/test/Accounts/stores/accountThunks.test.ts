import {
  fetchAccounts,
  addNewAccount,
  fetchAccountBalances,
} from '../../../features/Accounts/stores/accountThunks';
import { setupStore } from '../../../stores/store';
import * as AccountActions from '../../../features/Accounts/stores/accountSlice';
import * as DataFetch from '../../../utils/DataFetch';
import { mockThunkReturn } from '../../setupTests';
import Account from '../../../features/Accounts/types/types';

describe('Account Thunks', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');

  const mockStore = setupStore();
  const dispatch = mockStore.dispatch;

  const mockDispatch = jest.fn();
  mockDispatch.mockImplementation((action) => mockThunkReturn);

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
          json: () =>
            JSON.stringify({
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

      it.todo('Throws a BadResponseError');
    });
  });

  describe('addNewAccount', () => {
    describe('Given an ok response', () => {
      it.todo('Dispatches fetchAccounts and fetchAccountTypes');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });

  describe('fetchAccountBalances', () => {
    describe('Given an ok response', () => {
      it.todo('Dispatches updateAccoutnBalances');
    });

    describe('Given a bad resposne', () => {
      it.todo('Throws a BadResponseError');
    });
  });
});
