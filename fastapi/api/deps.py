from typing import Annotated
from sqlmodel import Session
from fastapi import Depends
from dotenv import load_dotenv
import os
from .database import get_session

load_dotenv()

SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

def get_db():
    db = get_session()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
