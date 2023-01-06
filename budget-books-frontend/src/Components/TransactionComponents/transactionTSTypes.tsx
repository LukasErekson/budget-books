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

type transactionData = {
  transaction_date: string;
  name: string;
  description: string;
  amount: string | number;
  credit_account_id?: number;
  debit_account_id?: number;
  category?: any;
};

type UploadableTransaction = {
  name: string;
  description: string;
  amount: number;
  debit_account_id?: number;
  credit_account_id?: number;
  transaction_date: string;
};

export { transactionData, UploadableTransaction };

export default Transaction;
