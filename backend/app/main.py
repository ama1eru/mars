from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.auth import router as auth_router
from app.transactions import router as transactions_router
from app.categories import router as categories_router
from app.database import engine

app = FastAPI(title="Personal Finance API", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    models.Base.metadata.create_all(bind=engine)


app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(transactions_router)


@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}
