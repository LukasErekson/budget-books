import { AppDispatch } from '../../../../stores/store';
import BadResponseError from '../../../../utils/BadResponseError';
import DataFetch from '../../../../utils/DataFetch';
import { ExpenseReportResponse } from '../types/types';
import { storeGeneratedReport } from './ExpenseReportSlice';

export const generateExpenseReport =
  (dateRanges: string[], accountGroups: string[]) =>
  async (dispatch: AppDispatch) => {
    try {
      const { responsePromise } = DataFetch(
        'POST',
        '/api/accounts/balances-by-group',
        {
          dateRanges,
          accountGroups,
        }
      );

      const response: Response = await responsePromise;
      if (response.ok) {
        const responseData: {
          message: string;
          [key: string]: any;
          serverError?: string;
        } = await response.json();

        if (responseData.message !== 'SUCCESS') {
          throw new BadResponseError(
            response.status,
            responseData.message,
            responseData.serverError ||
              'There was an irrecoverable server error.'
          );
        }

        // Remove message when storing
        const { message, ...reportData } = responseData;

        dispatch(storeGeneratedReport(reportData));
      }
    } catch (error) {
      console.log(error);
    }
  };
