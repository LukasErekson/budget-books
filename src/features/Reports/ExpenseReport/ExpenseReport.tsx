import React from 'react';
import { AccountGroupsToBalances, ExpenseReportResponse } from './types/types';
import dayjs from 'dayjs';

function ExpenseReport(props: {
  reportData: ExpenseReportResponse;
}): JSX.Element {
  const { dates, ...accountGroupsToBalances } = props.reportData;

  const displayDates: string[] = [];

  // Add Totals to Expense Report
  const datesToTotals: number[] = [];

  for (let i = 1; i < dates.length; i += 2) {
    displayDates.push(dayjs(dates[i]).format('MMM. DD, YYYY'));
    datesToTotals.push(0);
  }

  displayDates.push('Total');
  datesToTotals.push(0);

  const accountGroupsToBalancesWithTotals: AccountGroupsToBalances = JSON.parse(
    JSON.stringify(accountGroupsToBalances)
  );

  Object.keys(accountGroupsToBalances).forEach((groupName: string) => {
    Object.keys(accountGroupsToBalances[groupName]).forEach(
      (accountType: string) => {
        Object.keys(accountGroupsToBalances[groupName][accountType]).forEach(
          (accountName: string) => {
            accountGroupsToBalancesWithTotals[groupName][accountType][
              accountName
            ].push(
              accountGroupsToBalances[groupName][accountType][
                accountName
              ].reduce((prev: number, current: number) => prev + current),
              0
            );
            accountGroupsToBalancesWithTotals[groupName][accountType][
              accountName
            ].forEach((balance: number, index: number) => {
              datesToTotals[index] += balance;
            });
          }
        );
      }
    );
  });

  accountGroupsToBalancesWithTotals['Totals'] = {};
  accountGroupsToBalancesWithTotals['Totals'][''] = {};
  accountGroupsToBalancesWithTotals['Totals']['']['Total'] = datesToTotals;

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
      {Object.keys(accountGroupsToBalancesWithTotals).map(
        (groupName: string) => {
          return (
            <>
              <div key={groupName} className='expense-report-group-name'>
                {groupName}
              </div>
              {Object.keys(accountGroupsToBalancesWithTotals[groupName]).map(
                (accountType: string) => (
                  <>
                    <div
                      key={accountType}
                      className='expense-report-account-type'
                    >
                      {accountType}
                    </div>
                    {Object.keys(
                      accountGroupsToBalancesWithTotals[groupName][accountType]
                    ).map((accountName: string) => (
                      <>
                        <div className='expense-report-balance-row'>
                          <span
                            key={accountName}
                            className='expense-report-account-name'
                          >
                            {accountName}
                          </span>
                          {accountGroupsToBalancesWithTotals[groupName][
                            accountType
                          ][accountName]
                            .slice(0, -1) // TODO : Find out why an extra 0 gets tacked on the end
                            .map((balance: number, index: number) => (
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
        }
      )}
    </div>
  );
}

export default ExpenseReport;
