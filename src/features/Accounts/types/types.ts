type Account = {
  id: number;
  name: string;
  account_type_id: number;
  account_type: string;
  debit_inc: boolean | number;
  balance: number;
  last_updated: string;
  account_group: string;
};

type AccountOptions = {
  [accountGroup: string]: { label: string; value: number | string }[];
};

export default Account;

export { AccountOptions };
