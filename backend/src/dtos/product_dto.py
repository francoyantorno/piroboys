from pydantic import BaseModel

class CreateProductDTO(BaseModel):
    name: str
    price: float
    description: str

class ProductResponseDTO(BaseModel):
    id: int
    name: str
    price: float
    description: str
