from typing import Annotated
from sqlalchemy.orm import Session
from sqlmodel import Session, create_engine
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os


load_dotenv()

# Grab SECRET_KEY and ALGORITHM from our .env folder
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")
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


# Creates a database session
def get_db():
    db = get_session()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

# bcrypt hashes and verifies passwords
bcrpyt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Defines bearer tokens, which clients send in their Authorization: Bearer <token> header
oauth2_bearer = OAuth2PasswordBearer(tokenUrl = 'auth/token')
oauth2_bearer_dependency = Annotated[str, Depends(oauth2_bearer)]

# get_user decodes and verifies our JWT token with our SECRET_KEY
# Extracts subject (username) and id (user_id) from our payload
# Returns users info (username, user_id)
async def get_user(token: oauth2_bearer_dependency):
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Problem validating user')
        return {'username': username, 'id' : user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Problem validating user')
    

# This authenticates get_user() as a FASTAPI dependency
# Injects authenticated user data into routes that need authentication
user_dependency = Annotated[dict, Depends(get_user)]

