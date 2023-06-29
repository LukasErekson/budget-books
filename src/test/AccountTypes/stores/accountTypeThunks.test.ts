import { fetchAccountTypes } from '../../../features/AccountTypes/stores/accountTypeThunks';
import { setupStore } from '../../../stores/store';
import * as AccountTypeActions from '../../../features/AccountTypes/stores/accountTypeSlice';
import * as DataFetch from '../../../utils/DataFetch';
import { mockThunkReturn } from '../../setupTests';
import AccountType from '../../../features/AccountTypes/types/types';
import BadResponseError from '../../../utils/BadResponseError';
jest.mock('../../../utils/BadResponseError');

describe('Account Type Thunks', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');

  const mockStore = setupStore();
  const dispatch = mockStore.dispatch;

  const mockAccountTypes: AccountType[] = [
    { id: 1, name: 'Checking Account', group_name: 'Assets' },
    { id: 2, name: 'Credit Card', group_name: 'Liabilities' },
  ];

  describe('fetchAccountTypes', () => {
    it('defaults group to "all"', async () => {
      DataFetchMock.mockReturnValue({
        responsePromise: new Promise<any>((resolve) => {
          resolve({
            ok: true,
            json: () => ({
              message: 'SUCCESS',
              account_types: mockAccountTypes,
            }),
          });
        }),
        cancel: () => null,
      });

      await dispatch(fetchAccountTypes());

      expect(DataFetchMock).toHaveBeenCalledWith(
        'GET',
        '/api/accounttypes?group=all'
      );
    });

    describe('Given an ok response', () => {
      it('dispatches setAccountTypes', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve) => {
            resolve({
              ok: true,
              json: () => ({
                message: 'SUCCESS',
                account_types: mockAccountTypes,
              }),
            });
          }),
          cancel: () => null,
        });

        const setAccountTypes = jest.spyOn(
          AccountTypeActions,
          'setAccountTypes'
        );

        await dispatch(fetchAccountTypes());

        expect(DataFetchMock).toHaveBeenCalledWith(
          'GET',
          '/api/accounttypes?group=all'
        );

        expect(setAccountTypes).toHaveBeenCalledWith({
          accountTypes: mockAccountTypes,
          accountGroups: mockAccountTypes.map(
            (accountType) => accountType.group_name
          ),
        });
      });
    });

    describe('Given a bad response', () => {
      it('Throws a BadResponseError with message if provided', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve) => {
            resolve({
              ok: true,
              status: 404,
              json: () => ({
                message: 'FAILURE',
                account_types: [],
                serverError: 'There was a problem fetching group "all"',
              }),
            });
          }),
          cancel: () => null,
        });

        await dispatch(fetchAccountTypes());

        expect(BadResponseError).toHaveBeenCalledWith(
          404,
          'FAILURE',
          'There was a problem fetching group "all"'
        );
      });

      it('Throws a BadResponseError when ok is false', async () => {
        DataFetchMock.mockReturnValue({
          responsePromise: new Promise<any>((resolve) => {
            resolve({
              ok: false,
              status: 500,
            });
          }),
          cancel: () => null,
        });

        await dispatch(fetchAccountTypes());

        expect(BadResponseError).toHaveBeenCalledWith(
          500,
          'FAILURE',
          'There was an irrecoverable server error.'
        );
      });
    });
  });
});
