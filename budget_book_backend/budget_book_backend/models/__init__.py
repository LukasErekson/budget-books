"""Shared Database model architecture and items."""
import sqlalchemy
from sqlalchemy.orm import declarative_base
from sqlalchemy.engine import Engine

Base = declarative_base()


def get_db_engine(path: str = "databases/database.db") -> Engine:
    """Create a database engine given a path to find the sqlite db file.

    Parameters
    ----------
        path (str) : The path to find the database file for the sqlite3
            database to use to create the engine.

    Returns
    -------
        (sqlalchemy.engine.Engine) : The connected engine of the given
            path.
    """
    return sqlalchemy.create_engine(f"sqlite://{path}", future=True)
