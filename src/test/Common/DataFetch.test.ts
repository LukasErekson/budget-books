import DataFetch from '../../utils/DataFetch';

import * as fetchMock from 'jest-fetch-mock';

fetchMock.enableFetchMocks();

describe('DataFetch utility function', () => {
  afterEach(() => {
    fetchMock.default.mockClear();
  });

  afterAll(() => {
    fetchMock.disableFetchMocks();
  });

  describe('GET requests', () => {
    it('Returns an abort controller function and a promise', async () => {
      const response = DataFetch('GET', 'fake_url');

      expect(fetch).toHaveBeenCalledWith('fake_url', {
        method: 'GET',
        mode: 'cors',
        signal: expect.any(AbortSignal),
        headers: { 'Content-Type': 'application/json' },
        body: null,
      });
      expect(Object.keys(response)).toHaveLength(2);
      expect(response.cancel).toBeInstanceOf(Function);
      expect(response.responsePromise).toBeInstanceOf(Promise);
    });

    it('Returned abort controller calls abort for the signal', async () => {
      // Extract a real AbortSignal before mocking the AbortController class
      const { signal } = new AbortController();
      const abortFn = jest.fn();

      const abortMock = jest.spyOn(global, 'AbortController');
      abortMock.mockImplementation(() => ({
        abort: abortFn,
        signal: signal,
      }));

      const { cancel } = DataFetch('GET', 'fake-url');

      cancel();

      expect(abortFn).toHaveBeenCalled();

      abortMock.mockRestore();
    });

    it('Allows for custom headers', async () => {
      const { signal } = new AbortController();

      DataFetch('GET', 'fake-url', null, {
        'Content-Type': 'multipart/formdata',
      });

      expect(fetch).toHaveBeenCalledWith('fake-url', {
        method: 'GET',
        mode: 'cors',
        signal,
        headers: { 'Content-Type': 'multipart/formdata' },
        body: null,
      });
    });
  });

  describe('POST requests', () => {
    it('Returns an abort controller function and a promise', async () => {
      const response = DataFetch('POST', 'fake_url', {
        part: 'Fake request data',
      });

      expect(fetch).toHaveBeenCalledWith('fake_url', {
        method: 'POST',
        mode: 'cors',
        signal: expect.any(AbortSignal),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: 'Fake request data' }),
      });
      expect(Object.keys(response)).toHaveLength(2);
      expect(response.cancel).toBeInstanceOf(Function);
      expect(response.responsePromise).toBeInstanceOf(Promise);
    });

    it('Returned abort controller calls abort for the signal', async () => {
      // Extract a real AbortSignal before mocking the AbortController class
      const { signal } = new AbortController();
      const abortFn = jest.fn();

      const abortMock = jest.spyOn(global, 'AbortController');
      abortMock.mockImplementation(() => ({
        abort: abortFn,
        signal: signal,
      }));

      const { cancel } = DataFetch('POST', 'fake-url');

      cancel();

      expect(abortFn).toHaveBeenCalled();

      abortMock.mockRestore();
    });

    it('Allows for custom headers', async () => {
      const { signal } = new AbortController();

      DataFetch(
        'POST',
        'fake-url',
        { body: { data: { test: 'test' } } },
        {
          'Content-Type': 'multipart/formdata',
        }
      );

      expect(fetch).toHaveBeenCalledWith('fake-url', {
        method: 'POST',
        mode: 'cors',
        signal,
        headers: { 'Content-Type': 'multipart/formdata' },
        body: JSON.stringify({ body: { data: { test: 'test' } } }),
      });
    });
  });
});
