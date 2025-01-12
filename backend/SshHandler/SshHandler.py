import paramiko
from paramiko.ssh_exception import AuthenticationException, SSHException, NoValidConnectionsError
import logging
import os
from datetime import datetime
import re

from backend.Parser.Parser import Parser
from backend.MariaHandler.MariaHandler import MariaHandler
from backend.Utils.error_codes import map_error
from backend.Utils.password_generator import password_generator


class SshHandler:
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
            msg = f"Ошибка инициализации:\n {e}"
            logging.error(msg)
            raise KeyError(msg)

        self._client = paramiko.SSHClient()
        self._client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        self._connected = False

        self.parser = Parser(lpu_id=self._id)
        self.mh = MariaHandler(self._data)

    def connect(self):
        try:
            self._client.connect(
                hostname=self._host,
                port=self._port,
                username=self._user,
                password=self._password
            )
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

    def _exec_command(self, command, ans=True):
        if self._connected:
            try:
                stdin, stdout, stderr = self._client.exec_command(command)
                logging.info(f"Была выполнена команда {command}")
            except Exception as e:
                return "Ошибка при выполнении команды: " + str(e), False

            out = stdout.read().decode("utf-8", errors="ignore").strip()
            err = stderr.read().decode("utf-8", errors="ignore").strip()

            if err:
                return err, False

            if out:
                error_code = self.parser.get_error_code(text=out)
                if error_code == "0x00000000":
                    return out, True
                else:
                    return out, False

            if not ans:
                return "Вроде выполнилась, хз вообще", True

        else:
            msg = "Клиент не был подключен"
            logging.error(msg)
            return msg, False

    def _get_signs(self, key=""):
        command = f"/opt/cprocsp/bin/amd64/certmgr -list -dn {key}" if key else "/opt/cprocsp/bin/amd64/certmgr -list"
        out, ok = self._exec_command(command)
        return out, ok

    def get_parsed_signs(self):
        out, ok = self._get_signs()
        if not ok:
            return out, False

        parsing_error = self.parser.parse(out)
        if parsing_error:
            return parsing_error, False

        return self.parser.get_signs(), True

    def check_sign(self, snils=None, thumbprint=None, password=None):
        if not self._connected:
            msg = "Клиент не был подключен"
            logging.error(msg)
            return msg, False

        command = "touch ./228.pdf"
        out, ok = self._exec_command(command, ans=False)

        if not ok:
            return f"Ошибка при создании 228.pdf", False

        if snils:

            if password is None:
                password, ok = self.mh.get_person_password_by_snils(snils)
                if not ok:
                    return password, False

            command = f'/opt/cprocsp/bin/amd64/cryptcp -signf -cert -nochain -dn "{snils}" ./228.pdf -pin "{password}"'

        elif thumbprint:

            if password:
                command = f'/opt/cprocsp/bin/amd64/cryptcp -signf -cert -nochain -thumbprint {thumbprint} ./228.pdf -pin "{password}"'

            else:
                command = f'/opt/cprocsp/bin/amd64/cryptcp -signf -cert -nochain -thumbprint {thumbprint} ./228.pdf'

        out, ok = self._exec_command(command)

        if ok:
            return password, True

        error_code = self.parser.get_error_code(text=out)

        return map_error(error_code), False

    def find_sign_password(self, snils):
        for password in password_generator():
            pwd, ok = self.check_sign(snils=snils, password=password)
            print(f"Проверка пароля {repr(password)}")
            if ok:
                return pwd, True
        return "Пароль не был найден", False

    def delete_sign(self, thumbprint: str):
        if not self._connected:
            msg = "Клиент не был подключен"
            logging.error(msg)
            return msg, False

        command = f"/opt/cprocsp/bin/amd64/certmgr -delete -thumbprint {thumbprint}"

        out, ok = self._exec_command(command)
        if ok:
            return "Подпись удалена успешно", True
        else:
            return out, False

    def install_sign(self, folder_name):
        if not folder_name:
            return "Название контейнера не моежт быть пустым", False

        if not re.search(r'\.00.', folder_name):
            folder_name += ".000"

        sftp = self._client.open_sftp()

        try:
            file_path = self._path + "/" + folder_name
            sftp.stat(file_path)

            with sftp.open(file_path + "/name.key") as remote_file:
                content = remote_file.read()

            content_utf8 = content.decode('utf-8', errors="ignore")
            content_cp1251= content.decode('cp1251', errors="ignore")

            match_utf8 = re.match(r'[a-zA-Z0-9\s\-_]+', content_utf8[::-1])
            match_cp1251= re.match(r'[а-яА-Я0-9\s\-_]+', content_cp1251[::-1])

            if not match_utf8 and not match_cp1251:
                return "Название контейнера не было найдено", False
            elif match_utf8 and not match_cp1251:
                container_name = match_utf8.group()[::-1].strip()
            elif match_cp1251 and not match_utf8:
                container_name = match_cp1251.group()[::-1].strip()
            else:
                container_name = max(
                    [match_utf8.group()[::-1].strip(), match_cp1251.group()[::-1].strip()],
                    key=lambda x: len(x)
                )

            command = rf"/opt/cprocsp/bin/amd64/certmgr -install -container '\\.\HDIMAGE\{container_name}'"
            out, ok = self._exec_command(command)

            if not ok:
                return out, False

            self.parser.parse(out)

            signs = self.parser.get_signs()
            if not signs:
                return "Подпись не была установлена или не была выведена после установки", False
            elif len(signs) > 1:
                return "Было выведено несколько подписей", False

            snils = signs[0]["snils"]
            sha = signs[0]["sha"]

            return (snils, sha), True

        except FileExistsError:
            return "Контейнер не найден", False
        except Exception as e:
            return str(e), False
        finally:
            sftp.close()


if __name__ == "__main__":
    from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
    dh = DatabaseHandler()
    data, _ = dh.get_lpu(13)
    ssh = SshHandler(data)
    ssh.connect()
    print(ssh.find_sign_password(19964531029))


