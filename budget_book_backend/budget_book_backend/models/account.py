from sqlalchemy import Column, Boolean, Integer, String
from datetime import datetime
from models.transaction import Transaction

from models.db_setup import DbSetup


class Account(DbSetup.Base):
    """ORM for individual accounts.

    Each account always has an ID, a name, a balance, and whether or not
    debits increase or decrease the account.
    """

    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True)
    name = Column(String(120))
    account_type = Column(String(120))
    debit_inc = Column(Boolean)

    # Also has properties debit_transactions and credit_transactions for
    # the transactions that change the account balance.

    def balance(
        self,
        start_date: datetime = datetime(1, 1, 1),
        end_date: datetime = datetime.now(),
    ) -> float:
        """Return the net change balance of the account between the two
        given dates by calculating:
        (-1*debit_inc)*(sum(credit_transactions) - sum(debit_transactions)).

        Parameters
        -----------
            start_date (datetime) : Optional. The starting date when the
                account balance will be considered 0. This is so that
                the net change can be calculated with this one function.
                If not given, defaults to the earliest datetime Python
                allows.
            end_date (datetime) : Optional. The date to calculate the
                account balance change up to. Defaults to now.

        Returns
        -------
            account_balance (float) : The net change of the account
                balance within the given timeframe.
        """

        def transaction_filter(transaction: Transaction) -> float:
            """Returns the amount of the transaction if within the given
            dates, otherwise returns 0.

            Parameters
            ----------
                transaction (Transaction) : The transaction to check
                    whether it's within the given dates.

            Returns
            -------
                (float) : The amount of the transaction. If not within
                    the given dates, returns 0.
            """
            t_date = transaction.transaction_date
            if t_date > start_date and t_date < end_date:
                return transaction.amount

            return 0.0

        return (-1 * self.debit_inc) * (
            sum(map(transaction_filter, self.credit_transactions))
            - sum(map(transaction_filter, self.debit_transactions))
        )

    def __repr__(self):
        return (
            f"<Account id={self.id} name={self.name}, "
            f"type={self.account_type},  "
            f"debit_inc={self.debit_inc}>"
        )
