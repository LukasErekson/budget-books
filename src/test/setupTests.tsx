// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React, { PropsWithChildren } from 'react';
import { setupStore } from '../stores/store';
import { Provider } from 'react-redux';
import { PreloadedState } from 'redux';
import { render, RenderOptions } from '@testing-library/react';
import { RootState, AppStore } from '../stores/store';

export const fakePromise: Promise<any> = new Promise(() => null);

/**
 * Mock the return value of a thunk dispatch so that the mock
 * itself doesn't call anything.
 *
 * @returns {Promise<any>} An empty promise (rather sad to put it that way...)
 */
export function mockThunkReturn(): Promise<any> {
  return fakePromise;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

/**
 * Convenience function to wrap rendering elements in a redux store.
 *  Creates a new redux store on call and wraps whatever UI elements are
 * passed in within a Provider element.
 *
 * @param ui The react element(s) to render for the particlar test
 * @param options Options for testing library's render function, extended
 *  to include the initial state of the store or reuse an initialized
 *  store already.
 * @returns The same result as render but wrapped in the redux store.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
