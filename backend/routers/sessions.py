from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from routers.movies import db as movies_db

router = APIRouter(prefix="/sessions", tags=["sessions"])

db = [
    {"id": 1, "movie_id": 1, "time": "18:00", "price": 450, "seats": 50},
    {"id": 2, "movie_id": 1, "time": "21:00", "price": 550, "seats": 30},
    {"id": 3, "movie_id": 2, "time": "19:30", "price": 400, "seats": 60},
]
next_id = 4

class SessionIn(BaseModel):
    movie_id: int
    time: str
    price: int
    seats: int

@router.get("/")
def get_sessions(movie_id: int | None = Query(default=None)):
    """Возвращает все сеансы или фильтрует по movie_id, если параметр передан"""
    if movie_id is not None:
        return [s for s in db if s["movie_id"] == movie_id]
    return db

@router.post("/", status_code=201)
def add_session(session: SessionIn):
    """Добавляет новый сеанс"""
    global next_id
    
    if session.price <= 0:
        raise HTTPException(status_code=400, detail="Цена билета должна быть больше 0")
    if session.seats <= 0:
        raise HTTPException(status_code=400, detail="Количество мест должно быть больше 0")
    if not session.time.strip():
        raise HTTPException(status_code=400, detail="Время сеанса не может быть пустым")
        
    # Проверяем, существует ли фильм с переданным movie_id
    movie_exists = any(m["id"] == session.movie_id for m in movies_db)
    if not movie_exists:
        raise HTTPException(status_code=404, detail="Фильм не найден")
        
    new_session = {
        "id": next_id,
        "movie_id": session.movie_id,
        "time": session.time.strip(),
        "price": session.price,
        "seats": session.seats
    }
    db.append(new_session)
    next_id += 1
    return new_session

@router.delete("/{session_id}", status_code=204)
def delete_session(session_id: int):
    """Удаляет сеанс по ID"""
    global db
    before = len(db)
    db = [s for s in db if s["id"] != session_id]
    if len(db) == before:
        raise HTTPException(status_code=404, detail="Сеанс не найден")