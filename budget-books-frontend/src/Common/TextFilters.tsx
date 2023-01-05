function pyToJsDate(pyDate: string): string {
  let jsDate: string = '';
  let dateArray: string[] = pyDate.split('-');

  jsDate = `${dateArray[1]}/${dateArray[2].slice(0, 2)}/${dateArray[0]}`;
  return jsDate;
}

function dayMonthYear(jsDate: Date): string {
  let numericMonth: number = jsDate.getMonth() + 1;
  let numericDay: number = jsDate.getDate();
  return `${(numericDay < 10 ? '0' : '') + numericDay.toString()}-${
    (numericMonth < 10 ? '0' : '') + numericMonth.toString()
  }-${jsDate.getFullYear()}`;
}

function yearMonthDay(jsDate: Date): string {
  let numericMonth: number = jsDate.getMonth() + 1;
  let numericDay: number = jsDate.getDate();
  return `${jsDate.getFullYear()}-${
    (numericMonth < 10 ? '0' : '') + numericMonth.toString()
  }-${(numericDay < 10 ? '0' : '') + numericDay.toString()}`;
}

export { pyToJsDate, dayMonthYear, yearMonthDay };
