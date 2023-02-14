type Account = {
  id: number;
  name: string;
  account_type_id: number;
  account_type: string;
  debit_inc: boolean | number;
  balance: number;
  last_updated: string;
};

export default Account;
