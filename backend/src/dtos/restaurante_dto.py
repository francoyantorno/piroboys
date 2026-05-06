from pydantic import BaseModel

class CreateRestauranteDTO(BaseModel):
    name: str
    category: str
    address: str
    average_rating: int

class RestauranteResponseDTO(BaseModel):
    id: int
    name: str
    category: str
    address: str
    average_rating: int
