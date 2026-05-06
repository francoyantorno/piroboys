from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from src.db.connection import Base

class Notificacion(Base):
    __tablename__ = "Notificacion"

    id = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, unique=True, nullable=False)
    estado_nuevo = Column(Integer)
    fecha = Column(DateTime, default=func.now())
    leida = Column(Boolean, default=False)