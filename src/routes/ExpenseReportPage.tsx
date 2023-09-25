import React, { useEffect, useState } from 'react';
import ExpenseReportForm from '../features/Reports/ExpenseReport/ExpenseReportForm';
import { useSelector } from 'react-redux';
import { ExpenseReportResponse } from '../features/Reports/ExpenseReport/types/types';
import { RootState } from '../stores/store';
import ExpenseReport from '../features/Reports/ExpenseReport/ExpenseReport';
import { ThreeDots } from 'react-loader-spinner';

function ExpenseReportPage(): JSX.Element {
  const currentReportData: ExpenseReportResponse | null = useSelector(
    (state: RootState) => state.expenseReportSlice.currentReport
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading && currentReportData) {
      setIsLoading(false);
    }
  }, [currentReportData]);

  return (
    <>
      <h1>Expense Report Page</h1>
      <ExpenseReportForm setLoading={setIsLoading} />

      {isLoading && (
        <div className='loading-screen'>
          <ThreeDots
            height='80'
            width='80'
            radius='5'
            color='#cccccc'
            ariaLabel='three-dots-loading'
            wrapperStyle={{
              width: '80px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '5rem',
            }}
            visible={isLoading}
          />
          <p>Generating expense report...</p>
        </div>
      )}
      {currentReportData && !isLoading ? (
        <ExpenseReport reportData={currentReportData} />
      ) : (
        <p>
          Click on &quot;Generate Report&quot; to create a new Expense Report.
        </p>
      )}
    </>
  );
}

export default ExpenseReportPage;
