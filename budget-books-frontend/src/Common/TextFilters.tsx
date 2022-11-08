function pyToJsDate(pyDate: string): string {
    let jsDate: string = '';
    let dateArray: string[] = pyDate.split('-');

    jsDate = `${dateArray[2].slice(0, 2)}/${dateArray[1]}/${dateArray[0]}`;
    return jsDate;
}

export { pyToJsDate };
