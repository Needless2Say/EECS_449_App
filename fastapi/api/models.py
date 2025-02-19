"""
Models For Calorie Tracker Website
"""
from sqlmodel import SQLModel, Field, Relationship, String, Column, ForeignKey, UniqueConstraint
from typing import Optional
# from sqlalchemy import Column, Integer, String, ForeignKey, Table
# from sqlalchemy.orm import relationship
from .database import Base

# Example way of defining a table in our databse, 
# Stores username and hashed password
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str

