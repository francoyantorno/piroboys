from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from src.db.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    contrasena = Column(String, nullable=False)
    edad = Column(Integer, nullable=False)
    rol = Column(String, nullable=False)  # "cliente", "repartidor", "administrador"
    creado_en = Column(DateTime, server_default=func.now())
