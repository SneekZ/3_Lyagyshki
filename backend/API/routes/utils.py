from fastapi import APIRouter, HTTPException

from backend.MariaHandler.MariaHandler import MariaHandler
from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler

router = APIRouter()


@router.get("/available")
def get_check_available() -> dict:
    return {
        "data": True
    }


@router.get("/{lpu_id}/available/service")
def get_check_available_services(lpu_id: int) -> dict:
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

    return {
        "data": True 
    }