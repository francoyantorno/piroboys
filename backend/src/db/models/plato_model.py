from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from src.db.connection import Base

class Plato(Base):
    __tablename__ = "Plato"

    id = Column(Integer, primary_key=True)
    restaurante_id = Column(Integer, nullable=False)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String, nullable=False)
    precio = Column(Float, nullable=False)
    disponible = Column(Boolean, default=False)