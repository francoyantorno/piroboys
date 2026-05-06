from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.sql import func

from src.db.connection import Base

class Restaurante(Base):
    __tablename__ = "restaurante"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    calificacion_promedio = Column(Float, nullable=True)