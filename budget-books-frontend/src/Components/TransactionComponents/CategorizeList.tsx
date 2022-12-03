import React, { useEffect, useState } from 'react';
import DataFetch from '../../Common/DataFetch';
import CategorizeTxnForm from './CategorizeTxnForm';

function CategorizeList(props: { account: any }): JSX.Element {
  const [transactions, setTransactions]: [any[], Function] = useState([]);
  const [isTransactionsLoaded, setIsTransactionsLoaded]: [boolean, Function] =
    useState(false);

  const debitInc = props.account.debit_inc === 1;

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
      <div className='categorize-txn-form txn-form-header'>
        <span className='categorize-txn-item'>Date</span>{' '}
        <span className='categorize-txn-item'>Name</span>{' '}
        <span className='categorize-txn-item'>Description</span>{' '}
        <span className='categorize-txn-item'>Amount</span>
        <span className='categorize-txn-item'>Account</span>
        <span className='categorize-txn-item'></span>
      </div>
      <div className='txn-form-container'>
        {isTransactionsLoaded ? (
          transactions.map((txn) => (
            <CategorizeTxnForm
              key={txn.id}
              transacitonData={txn}
              debitInc={debitInc}
              excludeAccount={props.account}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default CategorizeList;
