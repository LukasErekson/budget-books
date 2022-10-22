# Budget Books Backend Code

## Routes

```python
"""
/api/transactions
-----------------
  GET : Return all the transactions that are associated with the account_id OR all of the given transaction categories.
    (user_id, account_id(s), and/or category_id(s)) => (message: str, transactions:[])

  POST : Add new transaction(s) to the respective accounts.
    (user_id and account_id(s)) => (message: str)

  PUT : Categorize the given transaction(s) to their respective category accounts.
    (user_id and transaction_ids and category/account_ids to map them to. Maybe even tuples?) => (message: str)

  PATCH : Change existing transaction(s) to have new values.
    (user_id and transaction_ids) => (message: str)

  DELETE : Delete transaction(s) of given id(s).
    (user_id and transaction_ids) => (message: str)

/api/accounts
-------------
  GET : Return all the accounts that are associated with the user, listing their id, name, balance (as of today), and whether they are a debit increase account or not.
    (user_id, balance_start_date?, balance_end_date?) => (message: str, acocunts:[])

  POST : Add a new account.
    (user_id, account_name, debit_inc) #=> (message: str)

  PATCH : Update an account's name, type, and whether or not it's a debit increase account.

"""
```
