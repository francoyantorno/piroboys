from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from src.db.connection import Base

class Zona(Base):
    __tablename__ = "Zona"

    id = Column(Integer, primary_key=True)
    restaurante_id = Column(Integer, nullable=False)
    nombre = Column(String(100), nullable=False)
    codigo_postal = Column(String(10), nullable=False)
