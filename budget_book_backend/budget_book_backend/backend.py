from os import path
from typing import Mapping
from flask import Flask
from flask_restful import Api


def create_app(test_config: Mapping = None) -> Flask:
    """Flask app function factory definition"""
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY="dev", DATABASE=path.join(app.instance_path, "database.db")
    )

    if test_config:
        app.config.from_mapping(test_config)

    api = Api(app)

    return app


def main(debug: bool = False) -> None:
    """Create and run the Flask app."""
    app = create_app()
    app.run(debug=debug)


if __name__ == "__main__":
    main(True)
