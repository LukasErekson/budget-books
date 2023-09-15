import React from 'react';
import { ExpenseReportResponse } from './types/types';

function ExpenseReport(props: { reportData: ExpenseReportResponse }) {
  const { dates, ...accountGroupsToBalances } = props.reportData;

  return (
    <div className='expense-report'>
      {Object.keys(accountGroupsToBalances).map((groupName: string) => {
        return (
          <>
            <div key={groupName} className='expense-report-group-name'>
              {groupName}
            </div>
            {Object.keys(accountGroupsToBalances[groupName]).map(
              (accountType: string) => (
                <>
                  <div
                    key={accountType}
                    className='expense-report-account-type'
                  >
                    {accountType}
                  </div>
                  {Object.keys(
                    accountGroupsToBalances[groupName][accountType]
                  ).map((accountName: string) => (
                    <>
                      <div className='expense-report-balance-row'>
                        <span
                          key={accountName}
                          className='expense-report-account-name'
                        >
                          {accountName}
                        </span>
                        {accountGroupsToBalances[groupName][accountType][
                          accountName
                        ].map((balance: number, index: number) => (
                          <span
                            key={`${accountName}-balance-${index}`}
                            className='expense-report-account-balance'
                          >
                            ${balance.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </>
                  ))}
                </>
              )
            )}
          </>
        );
      })}
    </div>
  );
}

export default ExpenseReport;
