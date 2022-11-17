from os import path
from typing import Mapping
from flask import Flask
from flask_restful import Api

from resources.accounts_resource import AccountResource
from resources.transactions_resource import TransactionsResource
from resources.user_resource import UserResource
from resources.account_types_resource import AccountTypeResource

from models.db_setup import DbSetup


def create_app(test_config: Mapping = None) -> Flask:
    """Flask app function factory definition"""
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE="sqlite:///"
        + path.join(path.dirname(__file__), "models/databases/database.db"),
    )

    print(app.config.get("DATABASE"))

    if test_config:
        app.config.from_mapping(test_config)

    with app.app_context():
        DbSetup.set_engine()
        DbSetup.add_tables()

    api = Api(app)

    api.add_resource(UserResource, "/api/users")
    api.add_resource(TransactionsResource, "/api/transactions")
    api.add_resource(AccountResource, "/api/accounts")
    api.add_resource(AccountTypeResource, "/api/accounttype")

    return app


def main(debug: bool = False) -> None:
    """Create and run the Flask app."""
    app = create_app()
    app.run(debug=debug)


if __name__ == "__main__":
    main(True)
