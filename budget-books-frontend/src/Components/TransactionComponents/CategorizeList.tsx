import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Account from '../AccountComponents/accountTSTypes';
import AddTxnForm from './AddTxnForm';
import CategorizeTxnForm from './CategorizeTxnForm';
import { selectUncategorizedTransactions } from './transactionSelectors';
import Transaction from './transactionTSTypes';

function CategorizeList(props: {
  account: Account;
  showAddNewTxn?: Boolean;
  setShowAddNewTxn: Function;
}): JSX.Element {
  const transactions: Transaction[] = useSelector((state: RootState) =>
    props.account.id
      ? selectUncategorizedTransactions(state, props.account.id)
      : []
  );

  const isTransactionsLoaded: boolean = useSelector(
    (state: RootState) => state.transactions.isTransactionsLoaded
  );

  const debitInc = props.account.debit_inc === 1;

  return (
    <>
      <div className='txn-form-container'>
        <div className='categorize-txn-form '>
          <span className='categorize-txn-item txn-form-header'>Date</span>{' '}
          <span className='categorize-txn-item txn-form-header'>Name</span>{' '}
          <span className='categorize-txn-item txn-form-header'>
            Description
          </span>{' '}
          <span className='categorize-txn-item txn-form-header'>Amount</span>
          <span className='categorize-txn-item txn-form-header'>Account</span>
          <span className='categorize-txn-item txn-form-header'></span>
        </div>
        {props.showAddNewTxn ? (
          <AddTxnForm
            account={props.account}
            debitInc={debitInc}
            setShowAddNewTxn={props.setShowAddNewTxn}
          />
        ) : (
          ''
        )}
        {isTransactionsLoaded ? (
          transactions.map((txn: Transaction) => (
            <CategorizeTxnForm
              key={txn.id}
              transacitonData={txn}
              debitInc={debitInc}
              account={props.account}
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
