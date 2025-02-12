from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
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
def add_lpu(lpuData: LPUData) -> dict:
    dict_lpuData = lpuData.model_dump()
    dh = DatabaseHandler()

    result, ok = dh.check_lpu_data(**dict_lpuData)
    if not ok:
        raise HTTPException(status_code=400, detail=result)
    
    result, ok = dh.add_lpu(**dict_lpuData)
    if not ok:
        raise HTTPException(status_code=400, detail=result)
    
    return {
        "data": result
    }
