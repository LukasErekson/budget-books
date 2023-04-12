import { fetchAccountTypes } from '../../../features/AccountTypes/stores/accountTypeThunks';
import { setupStore } from '../../../stores/store';
import * as AccountTypeActions from '../../../features/AccountTypes/stores/accountTypeSlice';
import * as DataFetch from '../../../utils/DataFetch';
import { mockThunkReturn } from '../../setupTests';
import AccountType from '../../../features/AccountTypes/types/types';
import BadResponseError from '../../../utils/BadResponseError';

describe('Account Type Thunks', () => {
  const DataFetchMock = jest.spyOn(DataFetch, 'default');

  const mockStore = setupStore();
  const dispatch = mockStore.dispatch;

  describe('fetchAccountTypes', () => {
    describe('Given an ok response', () => {
      it.todo('defaults group to "all"');

      it.todo('dispatches setAccountTypes');
    });

    describe('Given a bad response', () => {
      it.todo('Throws a BadResponseError');
    });
  });
});
