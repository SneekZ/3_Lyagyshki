from fastapi import APIRouter, HTTPException

from backend.MariaHandler.MariaHandler import MariaHandler
from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler

router = APIRouter()


@router.get("/{lpu_id}/event/{event_id}/person")
def get_exec_person(lpu_id: int, event_id: int) -> dict:
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

    person_id, ok = mh.get_event_exec_person_by_id(event_id)
    if not ok:
        raise HTTPException(status_code=400, detail=person_id)

    return {
        "data": person_id
    }