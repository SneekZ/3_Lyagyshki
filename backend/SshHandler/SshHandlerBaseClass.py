import paramiko
import logging
import os
from datetime import datetime

from backend.Parser.Parser import Parser
from backend.MariaHandler.MariaHandler import MariaHandler


class SshHandlerBaseClass:
    def __init__(self, data):
        _current_datetime = datetime.now()
        _current_datetime = _current_datetime.strftime("%Y-%m-%d_%H-%M-%S")

        log_dir = "log/"
        os.makedirs(log_dir, exist_ok=True)

        logging.basicConfig(
            filename=f"log/log_{_current_datetime}.log",
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        self._data = data

        try:
            self._id = data["id"]
            self._name = data["name"]
            self._host = data["host"]
            self._port = data["port"]
            self._user = data["user"]
            self._password = data["password"]
            self._dbhost = data["dbhost"] if "dbhost" in data else data["host"]
            self._dbport = data["dbport"]
            self._dbuser = data["dbuser"]
            self._dbpassword = data["dbpassword"]
            self._database = data["database"]
            self._path = data["path"]
            self._logger = data["logger"]
        except KeyError as e:
            msg = f"Ошибка инициализации ssh:\n {e}"
            logging.error(msg)
            raise KeyError(msg)

        self._client = paramiko.SSHClient()
        self._client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        self._transport = paramiko.Transport((self._host, self._port))
        self._sftp = None

        self._connected = False

        self.parser = Parser(lpu_id=self._id)
        self.mh = MariaHandler(self._data)