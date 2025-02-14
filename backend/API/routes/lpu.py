from fastapi import APIRouter, HTTPException, Cookie
from pydantic import BaseModel

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.AsyncLogger.AsyncLogger import log


router = APIRouter()


@router.get("/lpu")
def get_lpu_list() -> dict:
    dh = DatabaseHandler()

    lpu_list, ok = dh.get_all_lpu()
    if not ok:
        raise HTTPException(status_code=400, detail=lpu_list)

    return {
        "data": lpu_list
    }
class LPUData(BaseModel):
    name: str
    host: str
    port: int
    user: str
    password: str
    dbhost: str
    dbport: int
    dbuser: str
    dbpassword: str
    database: str
    path: str
    logger: str

@router.post("/lpu")
def add_lpu(lpuData: LPUData, user: str = Cookie("unknown")) -> dict:
    dict_lpuData = lpuData.model_dump()
    dh = DatabaseHandler()

    result, ok = log(user, 0, "lpu added", None, None, dict_lpuData["name"])
    if not ok:
        raise HTTPException(status_code=400, detail=result)

    result, ok = dh.check_lpu_data(**dict_lpuData)
    if not ok:
        raise HTTPException(status_code=400, detail=result)
    
    result, ok = dh.add_lpu(**dict_lpuData)
    if not ok:
        raise HTTPException(status_code=400, detail=result)
    
    return {
        "data": result
    }
