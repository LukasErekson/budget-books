import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import CategorizeTxnForm from './CategorizeTxnForm';
import { selectUncategorizedTransactions } from './transactionSelectors';
import { fetchTransactions } from './transactionThunks';

function CategorizeList(props: {
  account: any;
  fetchTransactions: Function;
}): JSX.Element {
  const transactions = useSelector((state: any) =>
    props.account.id
      ? selectUncategorizedTransactions(state, props.account.id)
      : []
  );

  const isTransactionsLoaded = useSelector(
    (state: any) => state.transactions.isTransactionsLoaded
  );

  const debitInc = props.account.debit_inc === 1;

  useEffect(() => {
    if (Object.keys(props.account).length && props.account.id) {
      props.fetchTransactions(props.account);
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
          transactions.map((txn: any) => (
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

const mapDispatchToProps = (dispatch: Function) => {
  return {
    fetchTransactions: (account: any) => dispatch(fetchTransactions(account)),
  };
};

export default connect(null, mapDispatchToProps)(CategorizeList);
