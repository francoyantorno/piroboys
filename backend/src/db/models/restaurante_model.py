from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.sql import func

from src.db.connection import Base

class Restaurante(Base):
    __tablename__ = "Restaurante"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    categoria = Column(String(50), nullable=False)
    direccion = Column(String, nullable=False)
    calificacion_promedio = Column(Float, nullable=True, default=0.0)