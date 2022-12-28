function pyToJsDate(pyDate: string): string {
  let jsDate: string = '';
  let dateArray: string[] = pyDate.split('-');

  jsDate = `${dateArray[1]}/${dateArray[2].slice(0, 2)}/${dateArray[0]}`;
  return jsDate;
}

function dayMonthYear(jsDate: Date): string {
  return `${jsDate.getDate()}-${jsDate.getMonth() + 1}-${jsDate.getFullYear()}`;
}

function yearMonthDay(jsDate: Date): string {
  return `${jsDate.getFullYear()}-${jsDate.getMonth() + 1}-${jsDate.getDate()}`;
}

export { pyToJsDate, dayMonthYear, yearMonthDay };
