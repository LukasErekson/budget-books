from db_setup import DbSetup
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from account import Account
from transaction import Transaction


def main(file_name: str, test: bool = True):
    """Create a Database and add the models (tables) to it."""
    DbSetup.engine = create_engine("sqlite:///" + file_name)
    DbSetup.Session = sessionmaker(bind=DbSetup.engine)
    DbSetup.add_tables()

    if test:
        amex = Account(
            name="AMEX",
            account_type="Credit Card",
            debit_inc=False,
        )
        trans1 = Transaction(
            name="Test Transaction",
            description="This is a test transaction",
            amount=25.43,
            credit_account_id=1,
        )
        payment1 = Transaction(
            name="Auto Payment",
            description="Auto pay",
            amount=25.43,
            debit_account_id=1,
        )
        with DbSetup.Session() as session:
            session.add_all([amex, trans1, payment1])
            session.commit()


if __name__ == "__main__":
    main("models/databases/database.db")
