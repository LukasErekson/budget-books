import React, { useEffect, useState } from 'react';
import DataFetch from '../../Common/DataFetch';
import CategorizeTxnForm from './CategorizeTxnForm';

function CategorizeList(props: { account: any }): JSX.Element {
  const [transactions, setTransactions]: [any[], Function] = useState([]);
  const [isTransactionsLoaded, setIsTransactionsLoaded]: [boolean, Function] =
    useState(false);

  async function fetchTransactions() {
    try {
      const {
        responsePromise,
      }: { cancel: Function; responsePromise: Promise<Response> } = DataFetch(
        'GET',
        `/api/transactions?account_ids=${props.account.id}`
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

  useEffect(() => {
    if (Object.keys(props.account).length) {
      fetchTransactions();
    }
  }, [props.account]);

  return (
    <>
      {isTransactionsLoaded ? (
        transactions.map((txn) => (
          <CategorizeTxnForm key={txn.id} transacitonData={txn} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default CategorizeList;
