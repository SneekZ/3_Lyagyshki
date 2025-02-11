from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import os, uuid, shutil

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.MariaHandler.MariaHandler import MariaHandler
from backend.SshHandler.SshHandler import SshHandler
from backend.SshHandler.SshTransportHandler import SshTransportHandler

router = APIRouter()

@router.get("/{lpu_id}/persons/snils/{snils}")
def get_containers_list(lpu_id: int, snils: int | str) -> dict:
    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        mh = MariaHandler(connection_data)
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

    data, ok = mh.get_all_person_by_snils(snils=snils)
    if not ok:
        raise HTTPException(status_code=400, detail=data)
    
    return {
        "data": data
    }