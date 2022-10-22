import json
import pandas as pd
from typing import Mapping
from flask_restful import Resource
from models.db_setup import DbSetup
from .utils import dict_to_json
from flask import request


class TransactionsResource(Resource):
    """Resource for interacting with transactions on the categorization
    page.
    """

    def get(self):
        """Get one or a list of transactions from the database."""
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
