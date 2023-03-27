/**
 * Handles working with a fetch request while allowing the fetch object to be aborted.
 * @param method The HTTP method used to fetch the data.
 * @param url The url to which to send the request.
 * @param requestData The body of the request.
 * @param headers Optional; The header content for the request. Defaults to {"Content-Type": "application/json"}
 * @returns cancel: A function that aborts the fetch request if it's still running.
 * @returns request: A promise that resolves to a response.
 */
function DataFetch(
  method: string,
  url: RequestInfo,
  requestData?: any,
  headers: HeadersInit = { 'Content-Type': 'application/json' }
): { cancel: () => void; responsePromise: Promise<Response> } {
  const controller = new AbortController();
  const signal = controller.signal;

  const fetchParams: RequestInit = requestData
    ? {
        method,
        mode: 'cors',
        headers,
        signal,
        body: JSON.stringify(requestData),
      }
    : {
        method,
        headers,
        signal,
        mode: 'cors',
        body: null,
      };

  return {
    cancel: () => controller.abort(),
    responsePromise: fetch(url, fetchParams),
  };
}

export default DataFetch;
