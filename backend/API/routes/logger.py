from fastapi import APIRouter, HTTPException

from backend.MariaHandler.MariaHandler import MariaHandler
from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler

router = APIRouter()


@router.get("/{lpu_id}/logger/{event_id}")
def get_logger(lpu_id: int, event_id: int) -> dict:
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

    logger, ok = mh.get_eventlog_by_event_id(event_id)
    if not ok:
        raise HTTPException(status_code=400, detail=logger)

    return {
        "data": logger
    }