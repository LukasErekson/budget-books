import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { useThunkDispatch } from '../../../hooks/hooks';
import { generateExpenseReport } from './stores/ExpenseReportThunks';
import { toast } from 'react-toastify';

const EXPENSE_REPORT_ACCOUNT_GROUPS = ['Income', 'Expenses', 'Misc.'];

function ExpenseReportForm(props: {
  setLoading: (loading: boolean) => void;
}): JSX.Element {
  const today: Date = new Date();
  const currentMonth: number = today.getMonth() + 1;
  const currentYear: number = today.getFullYear();

  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs(`${currentYear}-${currentMonth}-01`)
  );

  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs(`${currentYear}-${currentMonth}-${startDate?.daysInMonth()}`)
  );

  const [comparePreviousYear, setComparePreviousYear] = useState<boolean>(true);

  const thunkDispatch = useThunkDispatch();

  function generateReport(): void {
    if (!startDate) {
      return;
    }
    if (!endDate) {
      return;
    }
    if (startDate.isAfter(endDate)) {
      toast.error('Start Date must come before End Date.');
      return;
    }

    let dateRanges: Dayjs[] = [startDate, endDate];

    if (comparePreviousYear) {
      dateRanges = dateRanges.concat([
        startDate.subtract(1, 'year'),
        endDate.subtract(1, 'year'),
      ]);
    }

    const stringDateRanges: string[] = dateRanges.map((date: Dayjs) =>
      date.format('YYYY-MM-DD')
    );

    thunkDispatch(
      generateExpenseReport(stringDateRanges, EXPENSE_REPORT_ACCOUNT_GROUPS)
    );

    props.setLoading(true);

    return;
  }

  return (
    <div className='expense-report-form'>
      <DatePicker
        slotProps={{
          textField: { size: 'small' },
        }}
        label='Start Date'
        value={startDate || null}
        onChange={(value: Dayjs | null) => {
          setStartDate(dayjs(value));
        }}
      />
      <DatePicker
        slotProps={{
          textField: { size: 'small' },
        }}
        label='End Date'
        value={endDate || null}
        onChange={(value: Dayjs | null) => {
          setEndDate(dayjs(value));
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            inputProps={{ 'aria-label': 'controlled' }}
            checked={comparePreviousYear}
            value={comparePreviousYear}
            onChange={() => setComparePreviousYear((prev: boolean) => !prev)}
          />
        }
        label={'Compare Previous Year'}
      />

      <Button variant='contained' onClick={generateReport}>
        Generate Report
      </Button>
    </div>
  );
}

export default ExpenseReportForm;
