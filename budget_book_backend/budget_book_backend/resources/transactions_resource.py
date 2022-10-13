import json
import pandas as pd
from typing import Mapping
from flask_restful import Resource
from models.db_setup import DbSetup
from .utils import dict_to_json


class TransactionsResource(Resource):
    """Resource for interacting with transactions on the categorization
    page.
    """

    def get(self):
        """Get one or a list of transactions from the database."""

        df = pd.read_sql_table("transactions", DbSetup.engine)
        return json.dumps(dict_to_json(df.to_dict(), df.index))
