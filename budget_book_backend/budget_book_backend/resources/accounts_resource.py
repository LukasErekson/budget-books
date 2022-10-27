from datetime import datetime
import json
import pandas as pd
from typing import Mapping
from flask_restful import Resource
from models.db_setup import DbSetup
from .utils import dict_to_json
from flask import request
from models.account import Account


class AccountResource(Resource):
    """Resource for interacting with the account model."""

    def get(self):
        """Return all the accounts that are associated with the user,
        listing their id, name, balance (as of today), and whether they
        are a debit increase account or not.

        JSON Parameters
        ---------------
            user_id (int) : The user's unique ID. TODO : Implement
                verification, etc.
            account_type (str) : The type of accounts to fetch. Usually, one of
                "bank", "category", or "all". Defaults to "all"
            balance_start_date (date str) : When computing account
                balances, use this as the start date. Optional.
            balance_end_date (date str) : When computing account
                balances, use this as the end date. Optional.

        Example request.json:
        {
            "user_id": "0",
            "account_type": "bank",
        }
        """
        request_json: Mapping = request.get_json()

        user_id: int = request_json.get("user_id")

        account_type: str = request_json.get("account_type")

        types: tuple[str] | str = ()

        if account_type == "bank":
            types = ("Checking", "Savings", "Credit Card")
        else:
            types = account_type

        balance_start_date: str = request_json.get(
            "balance_start_date", datetime(1, 1, 1)
        )
        balance_end_date: str = request_json.get(
            "balance_end_date", datetime.now()
        )

        sql_statement: str = """SELECT * FROM accounts """

        if isinstance(account_type, str):
            sql_statement += f" WHERE account_type = '{account_type}'"
        elif types:
            sql_statement += f" WHERE account_type IN {types}"

        df: pd.DataFrame = pd.read_sql_query(sql_statement, DbSetup.engine)

        df["balance"] = 0.0

        with DbSetup.Session() as session:
            ids: list[int] = df["id"].to_list()

            account_objs = (
                session.query(Account).filter(Account.id.in_(ids)).all()
            )

            for account in account_objs:
                df.loc[df["id"] == account.id, "balance"] = account.balance(
                    balance_start_date, balance_end_date
                )

        return (
            json.dumps(
                dict(
                    message="SUCCESS",
                    accounts=dict_to_json(df.to_dict(), df.index),
                )
            ),
            200,
        )
