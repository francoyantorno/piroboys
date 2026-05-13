from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from src.db.connection import Base

class Cupon(Base):
    __tablename__ = "Cupon"

    id = Column(Integer, primary_key=True)
    codigo = Column(String(20), nullable=False, unique=True)
    porcentaje_descuento = Column(Integer, nullable=False)
    fecha_vencimiento = Column(DateTime, nullable=False)
    usos_maximos = Column(Integer, nullable=False)
    usos_actuales = Column(Integer, nullable=False, default=0)