import React from 'react';
import { ExpenseReportResponse } from './types/types';
import dayjs from 'dayjs';

function ExpenseReport(props: { reportData: ExpenseReportResponse }) {
  const { dates, ...accountGroupsToBalances } = props.reportData;

  const displayDates: string[] = [];

  for (let i = 1; i < dates.length; i += 2) {
    displayDates.push(dayjs(dates[i]).format('MMM. DD, YYYY'));
  }

  return (
    <div className='expense-report'>
      <h2 style={{ marginBottom: '.25rem' }}>Expense Report</h2>
      <p style={{ marginTop: 0 }}>
        From {dates[0]} through {dates.slice(-1)[0]}
      </p>
      <div
        className='expense-report-balance-row'
        style={{
          margin: '0 4rem',
        }}
      >
        <span
          className='expense-report-date-header'
          style={{ alignSelf: 'center' }}
        >
          End Date
        </span>
        {displayDates.map((date: string) => {
          return (
            <p className='expense-report-date' key={date}>
              {date}
            </p>
          );
        })}
      </div>
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
