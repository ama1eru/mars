from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.deps import get_current_user
from app.database import get_db

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("/", response_model=List[schemas.Category])
def list_categories(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Category).filter(models.Category.owner_id == current_user.id).all()


@router.post("/", response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def create_category(category_in: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    exists = (
        db.query(models.Category)
        .filter(models.Category.owner_id == current_user.id, models.Category.name == category_in.name)
        .first()
    )
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category already exists")
    category = models.Category(name=category_in.name, owner_id=current_user.id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
