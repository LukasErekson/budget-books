import React, { useState } from 'react';
import DataFetch from '../Common/DataFetch';
import { pyToJsDate } from '../Common/TextFilters';

function Transactions(): JSX.Element {
  const [transactions, setTransactions]: [any[], Function] = useState([]);
  const [isTransactionsLoaded, setIsTransactionsLoaded]: [boolean, Function] =
    useState(false);

  async function fetchTransactions() {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        '/api/transactions?account_ids=1,2'
      );

      const response = await responsePromise;

      if (response.ok) {
        const responseData: any = await response.json();
        setTransactions(JSON.parse(responseData.transactions));
        setIsTransactionsLoaded(true);
      } else {
        return { error: 'Problem!' };
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Aborted');
      }
      console.log(error);
    }
  }

  if (!isTransactionsLoaded) {
    fetchTransactions();
  }

  return (
    <>
      {isTransactionsLoaded ? (
        transactions.map((val) => (
          <p key={val.id}>
            {pyToJsDate(val.transaction_date)} {val.name}, {val.description} $
            {val.amount}
          </p>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default Transactions;
