from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from piroboys.backend.src.db.models import user_model
from user_model import User

from src.db.connection import Base

class Carrito_items(Base):
    __tablename__ = "carrito_items"

    id = Column(Integer, primary_key=True)
    carrito_id = Column(Integer, nullable=False)
    plato_id = Column(Integer, nullable=False)
    cantidad = Column(Integer, nullable=False)