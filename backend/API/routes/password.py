from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.MariaHandler.MariaHandler import MariaHandler
from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler

router = APIRouter()


@router.get("/{lpu_id}/password/{person_id}")
def get_password(lpu_id: int, person_id: int) -> dict:
    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        mh = MariaHandler(connection_data)

    except ConnectionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    password, ok = mh.get_person_password_by_id(person_id)
    if not ok:
        raise HTTPException(status_code=400, detail=password)

    return {
        "data": password
    }


class PasswordData(BaseModel):
    password: str | int


@router.post("/{lpu_id}/password/{person_id}")
def set_password(lpu_id: int, person_id: int, request: PasswordData) -> dict:
    password = request.password

    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        mh = MariaHandler(connection_data)

    except ConnectionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    msg, ok = mh.set_person_password_by_id(person_id, password)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    return {
        "ok": True
    }