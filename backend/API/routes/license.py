from fastapi import APIRouter, HTTPException

from backend.SshHandler.SshHandler import SshHandler
from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler

router = APIRouter()


@router.get("/{lpu_id}/license")
def get_license(lpu_id: int) -> dict:
    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        ssh = SshHandler(connection_data)

        connection_error = ssh.connect()
        if connection_error:
            raise HTTPException(status_code=400, detail=connection_error)

    except ConnectionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    result, ok = ssh.check_license()
    if ok:
        return result
    else:
        raise HTTPException(status_code=400, detail=result)