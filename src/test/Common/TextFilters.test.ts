import {
  pyToJsDate,
  dayMonthYear,
  yearMonthDay,
} from '../../utils/TextFilters';

describe('Text Filters utility functions', () => {
  describe('pyToJsDate', () => {
    it('Converts the date "2023-02-12" to "02/12/2023"', () => {
      const pythonDate = '2023-02-12';
      const expectedDate = '02/12/2023';

      expect(pyToJsDate(pythonDate)).toEqual(expectedDate);
    });

    it('Converts the date "2023-01-02" to "02/01/2023', () => {
      const pythonDate = '2023-01-02';
      const expectedDate = '01/02/2023';

      expect(pyToJsDate(pythonDate)).toEqual(expectedDate);
    });
  });

  describe('dayMonthYear', () => {
    it('Converts JS Date "Date(\'02/12/2023\')" to 12-02-2023', () => {
      const fromDate = new Date('02/12/2023');
      const toDate = '12-02-2023';

      expect(dayMonthYear(fromDate)).toEqual(toDate);
    });

    it('Converts JS Date "Date(\'02/08/2023\')" to 08-02-2023', () => {
      const fromDate = new Date('02/08/2023');
      const toDate = '08-02-2023';

      expect(dayMonthYear(fromDate)).toEqual(toDate);
    });

    it('Converts JS Date "Date(\'12/08/2023\')" to 08-12-2023', () => {
      const fromDate = new Date('12/08/2023');
      const toDate = '08-12-2023';

      expect(dayMonthYear(fromDate)).toEqual(toDate);
    });
  });

  describe('yearMonthDay', () => {
    it('Converts JS Date "Date(\'02/12/2023\')" to 2023-02-12', () => {
      const fromDate = new Date('02/12/2023');
      const toDate = '2023-02-12';

      expect(yearMonthDay(fromDate)).toEqual(toDate);
    });

    it('Converts JS Date "Date(\'02/08/2023\')" to 2023-02-08', () => {
      const fromDate = new Date('02/08/2023');
      const toDate = '2023-02-08';

      expect(yearMonthDay(fromDate)).toEqual(toDate);
    });

    it('Converts JS Date "Date(\'12/08/2023\')" to 2023-12-08', () => {
      const fromDate = new Date('12/08/2023');
      const toDate = '2023-12-08';

      expect(yearMonthDay(fromDate)).toEqual(toDate);
    });
  });
});
