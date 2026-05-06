from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from piroboys.backend.src.db.models import user_model
from user_model import User

from src.db.connection import Base

class Repartidor(User):
    __tablename__ = "repartidores"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    vehiculo = Column(String, nullable=False)
    disponible = Column(Boolean, default=True)