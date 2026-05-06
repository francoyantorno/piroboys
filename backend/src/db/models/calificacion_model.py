from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from src.db.connection import Base

class Calificacion(Base):
    __tablename__ = "calificacion"

    id = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, nullable=False)
    puntaje = Column(Integer, nullable=False)
    comentario = Column(String, nullable=True)
    fecha = Column(DateTime, default=func.now())