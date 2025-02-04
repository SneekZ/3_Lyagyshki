from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.MariaHandler.MariaHandler import MariaHandler
from backend.SshHandler.SshHandler import SshHandler
from backend.SshHandler.SshTransportHandler import SshTransportHandler

router = APIRouter()

@router.get("/{lpu_id}/container")
def get_containers_list(lpu_id: int) -> dict:
    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        ssh_transport = SshTransportHandler(connection_data)

        connection_error = ssh_transport.connect()
        if connection_error:
            raise HTTPException(status_code=400, detail=connection_error)

    except KeyError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    data, ok = ssh_transport.get_container_list()
    if not ok:
        raise HTTPException(status_code=400, detail=data)

    return {
        "data": data
    }
