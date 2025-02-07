import paramiko
import stat
from paramiko.ssh_exception import AuthenticationException, SSHException, NoValidConnectionsError
import logging
import os
from datetime import datetime
import re

from backend.Parser.Parser import Parser
from backend.MariaHandler.MariaHandler import MariaHandler
from backend.Utils.error_codes import map_error
from backend.Utils.password_generator import password_generator
from backend.SshHandler.SshHandlerBaseClass import SshHandlerBaseClass


class SshTransportHandler(SshHandlerBaseClass):
    def connect(self):
        try:
            self._transport.connect(username=self._user, password=self._password)
            self._sftp = paramiko.SFTPClient.from_transport(self._transport)
            self._connected = True
            logging.info(f"Подключено успешно к {self._name}")

        except AuthenticationException as auth_error:
            msg = f"Ошибка аутентификации: {auth_error}"
            logging.error(msg)
            return msg

        except NoValidConnectionsError as conn_error:
            msg = f"Не удается подключиться к серверу: {conn_error}"
            logging.error(msg)
            return msg

        except SSHException as ssh_error:
            msg = f"Ошибка SSH: {ssh_error}"
            logging.error(msg)
            return msg

        except Exception as e:
            msg = f"Произошла непредвиденная ошибка: {e}"
            logging.error(msg)
            return msg
    
    def get_container_list(self) -> tuple[str | list[str], bool]:
        files = None

        if not self._connected:
            return "Не подключено к sftp", False

        try:
            files = []
            for entry in self._sftp.listdir_attr(self._path):
                if stat.S_ISDIR(entry.st_mode):
                    files.append(entry.filename)

        except Exception as e:
            return str(e), False
        
        if not files:
            return "Директория с контейнерами пуста", False
        
        return files, True
    
    def load_file(self, local_file_path, unique_filename):
        if not self._connected:
            return "Не подключено к sftp", False
        
        remote_file_path = self._path + "/" + unique_filename

        try:
            self._sftp.put(local_file_path, remote_file_path)
            return (remote_file_path, self._path), True
        
        except Exception as e:
            return f"Ошибка при загрузке файла на сервер: {str(e)}", False
        
        finally:
            self._sftp.close()
        

        
