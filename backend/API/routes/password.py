from fastapi import APIRouter, HTTPException, Cookie
from pydantic import BaseModel
import asyncio

from backend.MariaHandler.MariaHandler import MariaHandler
from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.AsyncLogger.AsyncLogger import log, write_to_log
from backend.MariaHandler.AsyncMariaHandler import AsyncMariaHandler

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
    person_id: list[int]


@router.post("/{lpu_id}/password")
async def set_password(lpu_id: int, request: PasswordData, user: str = Cookie("unknown")) -> dict:
    password = request.password
    person_id_list = request.person_id


    result_log = asyncio.create_task(write_to_log(
        user,
        lpu_id,
        "password change",
        None,
        None,
        f"id:{', '.join(list(map(str, person_id_list)))}, password:{password}"
        ))

    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        amh = AsyncMariaHandler(connection_data)

    except ConnectionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    result_list = []
    for person_id in person_id_list:
        result_list.append(asyncio.create_task(amh.update_password_by_id(person_id, password)))

    result = await asyncio.gather(result_log, *result_list)
    for item in result:
        if isinstance(item, tuple) and len(item) > 1:
            if not item[1]:
                raise HTTPException(status_code=400, detail=item[0])
    
    return {
        "data": True
    }

    

