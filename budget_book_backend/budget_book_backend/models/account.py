from sqlalchemy import Column, Float, Boolean, Integer, String

from db_setup import DbSetup


class Account(DbSetup.Base):
    """ORM for individual accounts.

    Each account always has an ID, a name, a balance, and whether or not
    debits increase or decrease the account.
    """

    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True)
    name = Column(String(120))
    balance = Column(Float(precision=2))
    debit_inc = Column(Boolean)

    # Also has properties debit_transactions and credit_transactions for
    # the transactions that change the account balance.

    def __repr__(self):
        return (
            f"<Account id={self.id} name={self.name}, balance={self.balance}, "
            f"debit_inc={self.debit_inc}>"
        )
