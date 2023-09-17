import { Button, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { useThunkDispatch } from '../../../hooks/hooks';
import { generateExpenseReport } from './stores/ExpenseReportThunks';
import { ExpenseReportResponse, ReportFrequency } from './types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';

const EXPENSE_REPORT_ACCOUNT_GROUPS = ['Income', 'Expenses', 'Misc.'];

function ExpenseReportForm(): JSX.Element {
  const today: Date = new Date();
  const currentMonth: number = today.getMonth() + 1;
  const currentYear: number = today.getFullYear();

  const currentReportData: ExpenseReportResponse | null = useSelector(
    (state: RootState) => state.expenseReportSlice.currentReport
  );

  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs(`${currentYear}-${currentMonth}-01`)
  );

  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs(`${currentYear}-${currentMonth}-${startDate?.daysInMonth()}`)
  );

  const [frequency, setFrequency] = useState<ReportFrequency>(
    ReportFrequency.weekly
  );

  const thunkDispatch = useThunkDispatch();

  function generateReport(): void {
    // TODO : Form validations that startDate < endDate
    if (!startDate) {
      return;
    }
    if (!endDate) {
      return;
    }

    const dateRanges: Dayjs[] = [];

    let timesToSkip: number = endDate.diff(startDate, frequency);

    if (timesToSkip < 1) {
      timesToSkip = 1;
    }

    dateRanges.push(startDate);
    let startIndex = 0;

    for (let i = 0; i < timesToSkip; i++) {
      const nextStart: Dayjs = dateRanges[startIndex].add(1, frequency);
      const currentEnd: Dayjs = nextStart.subtract(1, 'day');
      dateRanges.push(currentEnd);
      dateRanges.push(nextStart);
      startIndex += 2;
    }

    if (endDate.isBefore(dateRanges.slice(-1)[0])) {
      dateRanges.pop();
    }

    if (dateRanges.length % 2 === 1) {
      dateRanges.push(endDate);
    }
    const stringDateRanges: string[] = dateRanges.map((date: Dayjs) =>
      date.format('YYYY-MM-DD')
    );

    thunkDispatch(
      generateExpenseReport(stringDateRanges, EXPENSE_REPORT_ACCOUNT_GROUPS)
    );

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
      <TextField
        select
        label='Frequency'
        value={frequency}
        size='small'
        style={{ width: '15ch' }}
        onChange={(event) => {
          if (
            (Object.values(ReportFrequency) as string[]).includes(
              event.target.value
            )
          ) {
            setFrequency(event.target.value as ReportFrequency);
          }
        }}
      >
        <MenuItem value={ReportFrequency.annually}>Annually</MenuItem>
        <MenuItem value={ReportFrequency.monthly}>Monthly</MenuItem>
        <MenuItem value={ReportFrequency.weekly}>Weekly</MenuItem>
        <MenuItem value={ReportFrequency.daily}>Daily</MenuItem>
      </TextField>

      <Button variant='contained' onClick={generateReport}>
        Generate Report
      </Button>
    </div>
  );
}

export default ExpenseReportForm;
