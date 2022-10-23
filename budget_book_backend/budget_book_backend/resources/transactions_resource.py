from datetime import datetime
import json
import pandas as pd
from typing import Mapping
from flask_restful import Resource
from models.db_setup import DbSetup
from .utils import dict_to_json
from flask import request
from models.transaction import Transaction


class TransactionsResource(Resource):
    """Resource for interacting with transactions on the categorization
    page.
    """

    def get(self):
        """Return all the transactions that are associated with the
        account_id OR all of the given transaction categories.

        Example request.json:
        {
          "account_ids": "[1, 2]",
          "user_id": "1"
        }
        """
        request_json: Mapping = request.get_json()

        user_id: int = request_json.get("user_id", None)

        account_ids: list[int] = request_json.get("account_ids", [])

        # TODO : Verify all account_ids belong to user for verification

        if len(account_ids) == 0:
            return (
                json.dumps(
                    dict(
                        message="ERROR: No account_ids found in the request."
                    ),
                ),
                500,
            )

        df: pd.DataFrame = pd.read_sql_query(
            f"""SELECT * FROM transactions
                WHERE debit_account_id IN {tuple(account_ids)}
                    OR credit_account_id IN {tuple(account_ids)}""",
            DbSetup.engine,
        )

        df.fillna("undefined", inplace=True)

        return_dict: dict = {
            "message": "SUCCESS",
            "transactions": json.dumps(dict_to_json(df.to_dict(), df.index)),
        }

        return (return_dict, 200)

    def post(self):
        """Add new transaction(s) to the respective accounts.

        Example request.json:
        {
            "user_id": "0",
            "transactions": [
                {
                    "name": "Test Post",
                    "description": "A Postman test to write to the database.",
                    "amount": "50.24",
                    "credit_account_id": "1",
                    "transaction_date": "2022-10-02"
                }
            ]
        }
        """
        request_json: Mapping = request.get_json()

        # TODO : User verification that all the accounts involved belong
        # to the user
        user_id: int = request_json.get("user_id", None)

        transactions: list[Mapping] = request_json.get("transactions", [])

        with DbSetup.Session() as session:
            new_transactions: list[Transaction] = []
            problem_transactions: list(tuple) = []

            for i, trxn in enumerate(transactions):
                try:
                    new_transactions.append(
                        Transaction(
                            name=trxn["name"],
                            description=trxn["description"],
                            amount=trxn["amount"],
                            debit_account_id=trxn.get("debit_account_id"),
                            credit_account_id=trxn.get("credit_account_id"),
                            transaction_date=datetime.fromisoformat(
                                trxn["transaction_date"]
                            ),
                            date_entered=datetime.now(),
                        )
                    )
                except Exception as e:
                    problem_transactions.append((i, str(e)))

            session.add_all(new_transactions)
            session.commit()

        message: str = "SUCCESS"

        if len(problem_transactions) != 0:
            message = (
                "There were some errors processing the following transactions:"
            )

            for idx, problem in problem_transactions:
                message += f"\n{idx}: {problem}"

        return (
            json.dumps(
                dict(
                    message=message,
                )
            ),
            200,
        )

    def put(self):
        """Categorize the given transaction(s) to their respective
            category accounts.

            Example request.json:
        {
          "user_id": "0",
          "transactions": [
            {
              "transaction_id": "1",
              "category_id": "1",
              "debit_or_credit": "debit"
            }
          ]
        }
        """
        request_json: Mapping = request.get_json()

        # TODO : User verification that all the accounts involved belong
        # to the user
        user_id: int = request_json.get("user_id", None)

        transactions: list[Mapping] = request_json.get("transactions", [])

        problem_transactions: list[tuple] = []

        with DbSetup.Session() as session:

            for i, trxn in enumerate(transactions):
                try:
                    transaction: Transaction = (
                        session.query(Transaction)
                        .filter(Transaction.id == trxn["transaction_id"])
                        .scalar()
                    )

                    if trxn["debit_or_credit"] == "debit":
                        transaction.debit_account_id = int(trxn["category_id"])
                    else:
                        transaction.credit_account_id = int(
                            trxn["category_id"]
                        )

                    session.commit()
                except Exception as e:
                    problem_transactions.append(i, str(e))

        message: str = "SUCCESS"

        if len(problem_transactions) != 0:
            message = (
                "There were some errors processing the following transactions:"
            )

            for idx, problem in problem_transactions:
                message += f"\n{idx}: {problem}"

        return (
            json.dumps(
                dict(
                    message=message,
                )
            ),
            200,
        )
