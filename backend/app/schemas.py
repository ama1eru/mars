from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True


class TransactionBase(BaseModel):
    amount: float
    note: Optional[str] = None
    occurred_at: Optional[datetime] = None
    category_id: Optional[int] = None


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class DashboardInsight(BaseModel):
    total_spent: float
    recent_transactions: List[Transaction]
    category_breakdown: List[dict]
    forecast_next_month: float
    generated_at: datetime

    @staticmethod
    def example() -> "DashboardInsight":
        now = datetime.utcnow()
        return DashboardInsight(
            total_spent=1240.5,
            recent_transactions=[],
            category_breakdown=[{"category": "Food", "amount": 520.0}, {"category": "Transport", "amount": 180.0}],
            forecast_next_month=1300.0,
            generated_at=now + timedelta(hours=1),
        )
