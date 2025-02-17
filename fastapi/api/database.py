from sqlmodel import create_engine, Session, text, delete, SQLModel
from dotenv import load_dotenv
import os


load_dotenv()
SQL_ALCHEMY_DATABASE_URL = os.getenv("SQL_ALCHEMY_DATABASE_URL")


def get_engine():
    """
    Get Engine To Database
    """
    return create_engine(SQL_ALCHEMY_DATABASE_URL, echo=True)


def get_session():
    """
    Get Connection and Create Session to Database
    """
    engine = get_engine()
    return Session(engine)
