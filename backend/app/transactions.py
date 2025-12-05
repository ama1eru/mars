from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.deps import get_current_user
from app.database import get_db

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("/", response_model=List[schemas.Transaction])
def list_transactions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Transaction).filter(models.Transaction.owner_id == current_user.id).all()


@router.post("/", response_model=schemas.Transaction, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_in: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    transaction = models.Transaction(
        amount=transaction_in.amount,
        note=transaction_in.note,
        occurred_at=transaction_in.occurred_at,
        category_id=transaction_in.category_id,
        owner_id=current_user.id,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id, models.Transaction.owner_id == current_user.id
    ).first()
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return None


@router.get("/insights/sample", response_model=schemas.DashboardInsight)
def sample_insights(current_user: models.User = Depends(get_current_user)):
    # Поведенческие инсайты могут строиться асинхронно через Celery/Redis; здесь — примеры значений.
    return schemas.DashboardInsight.example()
