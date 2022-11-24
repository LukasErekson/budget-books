from datetime import datetime
import json
import pandas as pd
from typing import Mapping
from flask_restful import Resource
from models.db_setup import DbSetup
from .utils import dict_to_json, endpoint_error_wrapper
from flask import request
from models.account import Account


class AccountResource(Resource):
    """Resource for interacting with the account model."""

    @endpoint_error_wrapper
    def get(self):
        """Return all the accounts that are associated with the user,
        listing their id, name, balance (as of today), and whether they
        are a debit increase account or not.

        Request Arguments
        -----------------
            account_type (str) : The type of accounts to fetch. Usually, one of
                "bank", "category", or "all". Defaults to "all"
            balance_start_date (date str) : When computing account
                balances, use this as the start date. Optional.
            balance_end_date (date str) : When computing account
                balances, use this as the end date. Optional.

        Example url:
            ?balance_start_date=2022-10-02&account_type=bank
        """
        account_type: str = request.args.get("account_type", "all")

        types: tuple[str] | str = ()

        if account_type == "bank":
            types = ("Checking", "Savings", "Credit Card")
        else:
            types = account_type

        balance_start_date: str = request.args.get(
            "balance_start_date", datetime(1, 1, 1)
        )
        balance_end_date: str = request.args.get(
            "balance_end_date", datetime.now()
        )

        if isinstance(balance_start_date, str):
            balance_start_date = datetime.strptime(
                balance_start_date, "%Y-%m-%d"
            )

        if isinstance(balance_end_date, str):
            balance_start_date = datetime.strptime(
                balance_end_date, "%Y-%m-%d"
            )

        sql_statement: str = """SELECT * FROM accounts """

        if isinstance(types, str):
            if types != "all":
                sql_statement += f" WHERE account_type = '{account_type}'"
        elif types:
            sql_statement += f" WHERE account_type IN {types}"
        df: pd.DataFrame = pd.read_sql_query(sql_statement, DbSetup.engine)

        df["balance"] = 0.0
        df["start_date"] = datetime.strftime(balance_start_date, "%Y-%m-%d")
        df["end_date"] = datetime.strftime(balance_end_date, "%Y-%m-%d")
        df["last_updated"] = datetime.strftime(datetime.today(), "%Y-%m-%d")
        df["uncategorized_transactions"] = 0
        df["account_type"] = ""

        with DbSetup.Session() as session:
            ids: list[int] = df["id"].to_list()

            account_objs = (
                session.query(Account).filter(Account.id.in_(ids)).all()
            )

            for account in account_objs:
                df.loc[df["id"] == account.id, "balance"] = account.balance(
                    balance_start_date, balance_end_date
                )
                df.loc[
                    df["id"] == account.id, "uncategorized_transactions"
                ] = len(
                    account.uncategorized_transactions(
                        balance_start_date, balance_end_date
                    )
                )
                df.loc[
                    df["id"] == account.id, "last_updated"
                ] = datetime.strftime(account.last_updated(), "%Y-%m-%d")
                df.loc[
                    df["id"] == account.id, "account_type"
                ] = account.account_type.name

        return (
            dict(
                message="SUCCESS",
                accounts=json.dumps(dict_to_json(df.to_dict(), df.index)),
            ),
            200,
        )

    @endpoint_error_wrapper
    def post(self):
        """Add a new account.

        JSON Parameters
        ---------------
            name (str) : The name of the account- what it will appear as
                accross the app and on the balance sheet/expense report.
            account_type_id (int) : The id for the account_type that the
                account should be. This will come from the user in a
                form request when creating a new account.
            debit_inc (bool): Whether debits to the account increase the
                balance or not.

        Example request.json:
        {
            "name": "American Express CC",
            "account_type_id": "1",
            "debit_inc": false
        }
        """
        request_json: Mapping = request.get_json()

        with DbSetup.Session() as session:
            try:
                new_acct: Account = Account(
                    name=request_json["name"],
                    account_type_id=request_json["account_type_id"],
                    debit_inc=request_json["debit_inc"],
                )

                session.add(new_acct)

                session.commit()

            except Exception as e:
                return (
                    json.dumps(
                        dict(
                            message="There was a problem posting the new account.",
                            error=str(e),
                        )
                    ),
                    500,
                )

        return (
            json.dumps(
                dict(message="SUCCESS", account_name=request_json["name"])
            ),
            200,
        )
