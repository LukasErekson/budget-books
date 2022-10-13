import sqlalchemy
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.engine import Engine

Base = declarative_base()


def get_db_engine(path: str = "models/databases/database.db") -> Engine:
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
    return sqlalchemy.create_engine(f"sqlite:///{path}", future=True)


def get_db_session(engine: Engine) -> Session:
    """Create a database session within a given database session.

    Parameters
    ----------
        engine (sqlalchemy.engine.Engine) : The SQLAlchemy engine to use
            when creating a session.

    Returns
    -------
        (Session) : The session created using the function
        sqlalchemy.orm.sessionmaker.
    """
    return sessionmaker(bind=engine)
