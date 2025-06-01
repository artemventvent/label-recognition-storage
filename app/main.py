from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import DateTime
from datetime import datetime

DATABASE_URL = "sqlite:///./labels.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class Label(Base):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    confidence = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class LabelOut(BaseModel):
    id: int
    name: str
    confidence: str
    created_at: datetime

    class Config:
        orm_mode = True

Base.metadata.create_all(bind=engine)

class LabelCreate(BaseModel):
    name: str
    confidence: str

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
def read_index():
    return FileResponse("app/static/index.html")

@app.post("/labels", response_model=LabelOut)
def create_label(label: LabelCreate):
    db = SessionLocal()
    db_label = Label(name=label.name, confidence=label.confidence)
    db.add(db_label)
    db.commit()
    db.refresh(db_label)
    db.close()
    return db_label

@app.get("/labels", response_model=list[LabelOut])
def read_labels():
    db = SessionLocal()
    labels = db.query(Label).all()
    db.close()
    return labels

@app.delete("/labels/{label_id}")
def delete_label(label_id: int):
    db = SessionLocal()
    label = db.query(Label).filter(Label.id == label_id).first()
    if label is None:
        db.close()
        raise HTTPException(status_code=404, detail="Label not found")
    db.delete(label)
    db.commit()
    db.close()
    return {"detail": f"Label {label_id} deleted"}

@app.put("/labels/{label_id}")
def update_label(label_id: int, updated: LabelCreate):
    db = SessionLocal()
    label = db.query(Label).filter(Label.id == label_id).first()
    if label is None:
        db.close()
        raise HTTPException(status_code=404, detail="Label not found")
    label.name = updated.name
    label.confidence = updated.confidence
    db.commit()
    db.refresh(label)
    db.close()
    return label
