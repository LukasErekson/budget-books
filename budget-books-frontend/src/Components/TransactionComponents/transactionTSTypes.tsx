interface Transaction {
  id: number;
  name: string;
  description: string;
  amount: number;
  debit_account_id: number | string;
  credit_account_id: number | string;
  transaction_date: string;
  date_entered: string;
}

export default Transaction;
