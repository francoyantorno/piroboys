from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from piroboys.backend.src.db.models import user_model
from user_model import User    

from src.db.connection import Base

class Cliente(User):
    __tablename__ = "Cliente"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    telefono = Column(Integer, unique=True, nullable=False)
    codigo_postal = Column(Integer, nullable=False)
    email = Column(String, unique=True, nullable=False)
    
    