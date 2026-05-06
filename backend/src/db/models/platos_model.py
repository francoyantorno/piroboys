from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from src.db.connection import Base

class Platos(Base):
    __tablename__ = "Plato"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    precio = Column(Integer, nullable=False)
    disponible = Column(Boolean, default=False)
    restaurante_id = Column(Integer, nullable=False)