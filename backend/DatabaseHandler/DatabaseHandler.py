import paramiko, mariadb

from backend.DatabaseHandler.config import create_session, LPUData, mapper


class DatabaseHandler:

    @staticmethod
    def check_lpu_data(
            name: str = '',
            host: str = '',
            port: int = 22,
            user: str = 'root',
            password: str = 'shedF34A',
            dbhost: str = '',
            dbport: int = 3306,
            dbuser: str = 'dbuser',
            dbpassword: str = 'dbpassword',
            database: str = 's11',
            path: str = '/var/opt/cprocsp/keys/root',
            logger: str = 'logger'
    ) -> tuple[str, bool]:
        if not all([name, host, dbhost]):
            error = ""
            if not name:
                error += "Нужно ввести имя ЛПУ, "
            if not host:
                error += "Нужно ввести хост сервера сервисов, "
            if not dbhost:
                error += "Нужно ввести хост базы данных."
            return error, False
        
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            ssh.connect(
                hostname=host,
                port=port,
                username=user,
                password=password
            )
        except Exception as e:
            return f"Не удалось подключиться к серверу сервисов: {str(e)}", False
        
        finally:
            ssh.close()

        try:
            conn = mariadb.connect(
                user=dbuser,
                password=dbpassword,
                host=dbhost,
                port=dbport,
                database=database
            )
            conn.close()
        
        except Exception as e:
            return f"Не удалось подключиться к базе данных: {str(e)}", False
        
        return "OK", True

    @staticmethod
    def add_lpu(
        name: str = '',
        host: str = '',
        port: int = 22,
        user: str = 'root',
        password: str = 'shedF34A',
        dbhost: str = '',
        dbport: int = 3306,
        dbuser: str = 'dbuser',
        dbpassword: str = 'dbpassword',
        database: str = 's11',
        path: str = '/var/opt/cprocsp/keys/root',
        logger: str = 'logger'
    ) -> tuple[str, bool]:
        session = create_session()

        try:
            new_lpu = LPUData(
                name=name,
                host=host,
                port=port,
                user=user,
                password=password,
                dbhost=dbhost,
                dbport=dbport,
                dbuser=dbuser,
                dbpassword=dbpassword,
                database=database,
                path=path,
                logger=logger
            )
            session.add(new_lpu)
            session.commit()

        except Exception as e:
            return f"Не удалось добавить запись в бд: {str(e)}", False
        
        return "OK", True


    @staticmethod
    def get_all_lpu() -> (list[dict] | str, bool):
        session = create_session()
        data = session.query(LPUData).all()
        if not data:
            return "Данные о подключениях к ЛПУ не были найдены", False
        mapped_data = list(map(mapper, data))
        if not mapped_data:
            return "Данные о подключениях к ЛПУ не были размечены", False
        return mapped_data, True

    @staticmethod
    def get_lpu(id: int | str) -> (dict | str, bool):
        session = create_session()
        data = session.query(LPUData).filter_by(id=id).first()
        if not data:
            return f"ЛПУ с id = {id} не была найдена", False
        mapped_data = mapper(data)
        if not mapped_data:
            return f"Данные ЛПУ с id = {id} не были размечены", False
        return mapped_data, True



# if __name__ == "__main__":
#     dbh = DatabaseHandler
#     data = dbh.get_lpu(3)
#     print(data)

