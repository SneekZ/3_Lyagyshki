from fastapi import APIRouter, HTTPException, UploadFile, File, Cookie
from pydantic import BaseModel
import os, uuid, shutil

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.MariaHandler.MariaHandler import MariaHandler
from backend.SshHandler.SshHandler import SshHandler
from backend.SshHandler.SshTransportHandler import SshTransportHandler
from backend.AsyncLogger.AsyncLogger import log, write_to_log

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

class ContainerData(BaseModel):
    container_name: str


@router.post("/{lpu_id}/container/install/container")
def post_install_sign_by_container_name(lpu_id: int, request: ContainerData, user: str = Cookie("unknown")) -> dict:
    
    container_name = request.container_name

    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        ssh = SshHandler(connection_data)

        connection_error = ssh.connect()
        if connection_error:
            raise HTTPException(status_code=400, detail=connection_error)

    except KeyError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    result, ok = ssh.install_sign_by_container_name(container_name)
    if not ok:
        raise HTTPException(status_code=400, detail=result)
    
    result_log, ok = log(user, lpu_id, "install sign", result[0], result[1], None)
    if not ok:
        raise HTTPException(status_code=400, detail=result_log)

    return {
        "snils": result[0],
        "sha": result[1]
    }

@router.post("/{lpu_id}/container/install/name")
def post_install_sign(lpu_id: int, request: ContainerData, user: str = Cookie("unknown")) -> dict:
    container_name = request.container_name

    dh = DatabaseHandler()
    connection_data, ok = dh.get_lpu(lpu_id)
    if not ok:
        raise HTTPException(status_code=400, detail=connection_data)

    try:
        ssh = SshHandler(connection_data)

        connection_error = ssh.connect()
        if connection_error:
            raise HTTPException(status_code=400, detail=connection_error)

    except KeyError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    result, ok = ssh.install_sign(container_name)
    if not ok:
        raise HTTPException(status_code=400, detail=result)
    
    result_log, ok = log(user, lpu_id, "install sign", result[0], result[1], None)
    if not ok:
        raise HTTPException(status_code=400, detail=result_log)

    return {
        "snils": result[0],
        "sha": result[1]
    }

@router.post("/{lpu_id}/container/upload")
async def post_upload_file_on_server(lpu_id: int, user: str = Cookie("unknown"), file: UploadFile = File(...)):
    file_extension = os.path.splitext(file.filename)[-1]
    if file_extension != ".zip":
        raise HTTPException(status_code=400, detail="Принимаются только zip архивы")
    unique_filename = f"{uuid.uuid4()}{file_extension}"

    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(current_dir, '..', '..', '..'))
    local_file_path = os.path.join(project_root, 'temp', unique_filename)

    try:
        with open(local_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при сохранении файла {e}")
    
    finally:
        file.file.close()

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
    
    data, ok = ssh_transport.load_file(local_file_path=local_file_path, unique_filename=unique_filename)

    if not ok:
        raise HTTPException(status_code=400, detail=str(e))
    
    try:
        ssh = SshHandler(connection_data)

        connection_error = ssh.connect()
        if connection_error:
            raise HTTPException(status_code=400, detail=connection_error)
        
    except KeyError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    remote_file_path, remote_path = data
    result, ok = ssh.unarchive(remote_file_path, remote_path)
    if not ok:
        raise HTTPException(status_code=400, detail=result)
    
    if os.path.exists(local_file_path):
        os.remove(local_file_path)

    await write_to_log(user, lpu_id, "upload container on server", None, None, remote_file_path)

    return {
        "message": result,
        "data": result
    }

    

    