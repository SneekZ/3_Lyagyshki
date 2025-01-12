from fastapi import APIRouter, HTTPException

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
