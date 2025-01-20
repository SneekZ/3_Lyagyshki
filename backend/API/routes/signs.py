from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.MariaHandler.MariaHandler import MariaHandler
from backend.SshHandler.SshHandler import SshHandler

router = APIRouter()


@router.get("/{lpu_id}/signs")
def get_signs(lpu_id: int) -> dict:
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

    data, ok = ssh.get_parsed_signs()
    if not ok:
        raise HTTPException(status_code=400, detail=data)

    return {
        "data": data
    }


@router.get("/{lpu_id}/signs/check/snils/{snils}")
def get_check_sign_by_snils(lpu_id: int, snils: int | str) -> dict:
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

    result, ok = ssh.check_sign(snils=snils)
    return {
        "ok": ok,
        "data": result
    }


@router.get("/{lpu_id}/signs/check/id/{person_id}")
def get_check_sign_by_person_id(lpu_id: int, person_id: int | str) -> dict:
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

    snils, ok = mh.get_person_snils_by_id(person_id)
    if not ok:
        raise HTTPException(status_code=400, detail=snils)

    result, ok = ssh.check_sign(snils=snils)
    return {
        "ok": ok,
        "data": result
    }


class ThumbprintData(BaseModel):
    thumbprint: str
    password: None | str | int


@router.post("/{lpu_id}/signs/check/thumbprint")
def post_check_sign_by_thumbprint(lpu_id: int, data: ThumbprintData) -> dict:
    thumbprint = data.thumbprint
    password = data.password

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

    result, ok = ssh.check_sign(thumbprint=thumbprint, password=password)
    return {
        "ok": ok,
        "data": result
    }


class ContainerData(BaseModel):
    container_name: str


@router.post("/{lpu_id}/signs/install/container")
def post_install_sign_by_container_name(lpu_id: int, request: ContainerData) -> dict:
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

    return {
        "snils": result[0],
        "sha": result[1]
    }

@router.post("/{lpu_id}/signs/install/name")
def post_install_sign(lpu_id: int, request: ContainerData) -> dict:
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

    return {
        "snils": result[0],
        "sha": result[1]
    }


class ShaData(BaseModel):
    sha: str


@router.delete("/{lpu_id}/signs/delete")
def delete_sign(lpu_id: int, request: ShaData) -> dict:
    sha = request.sha

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

    result, ok = ssh.delete_sign(sha)
    if not ok:
        raise HTTPException(status_code=400, detail=result)

    return {
        "data": "OK"
    }

class IdsList(BaseModel):
    data: list[str]


@router.post("/{lpu_id}/signs/check/id/list")
def get_check_sign_by_id_list(lpu_id: int, request: IdsList) -> dict:
    data = set(request.data)

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

    result = []
    for id in data:
        snils, ok = mh.get_person_snils_by_id(id)
        if not ok:
            result.append({
                "id": id,
                "snils": None,
                "result": snils,
                "password": None
            })
            continue
        password, ok = ssh.check_sign(snils=snils)
        if not ok:
            result.append({
                "id": id,
                "snils": snils,
                "result": password,
                "password": None
            })
            continue
        result.append({
            "id": id,
            "snils": snils,
            "result": "OK",
            "password": password
        })
    
    return {
        "data": result
    }
