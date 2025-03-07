from sqlalchemy import select, and_, not_, func, Null , update
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

import ast
from sqlalchemy.orm import sessionmaker

from backend.MariaHandler.config import *
from backend.MariaHandler.settings import ASYNC_DATABASE_ENGINE, CHECK_ERRORS

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.Utils.decryptor import decrypt_password, encrypt_password


class AsyncMariaHandler:

    def __init__(self, connection_data: dict) -> None:
        error, ok = self._check_connection_data(connection_data=connection_data)
        if not ok:
            raise ConnectionError(error)
        self.engine_main = create_async_engine(ASYNC_DATABASE_ENGINE + f"{connection_data['dbuser']}:{connection_data['dbpassword']}@{connection_data['dbhost']}:{connection_data['dbport']}/{connection_data['database']}")
        self.engine_logger= create_async_engine(ASYNC_DATABASE_ENGINE + f"{connection_data['dbuser']}:{connection_data['dbpassword']}@{connection_data['dbhost']}:{connection_data['dbport']}/{connection_data['logger']}")

    def _session_maker_main(self):
        AsyncSess = sessionmaker(
            self.engine_main,
            expire_on_commit=False,
            class_=AsyncSession
        )
        return AsyncSess

    def _session_maker_logger(self):
        AsyncSess = sessionmaker(
            self.engine_logger,
            expire_on_commit=False,
            class_=AsyncSession
        )
        return AsyncSess

    async def update_password_by_id(self, id: int | str, password: str ='') -> tuple[str, bool]:
        try:
            encrypted_password = encrypt_password(password)

            async with self._session_maker_main()() as session:
                stmt = (
                    update(Person)
                    .where(Person.id == id)
                    .values(ecp_password=encrypted_password)
                )
                await session.execute(stmt)
                await session.commit()
            
            return "Пароль успешно обновлен", True
            
        except Exception as e:
            return str(e), False



    @staticmethod
    def _check_connection_data(connection_data):
        if not isinstance(connection_data, dict):
            return "Данные для подключения должны быть словарем", False

        if not connection_data:
            return "Данные пустые", False

        for key, msg in CHECK_ERRORS.items():
            if key not in connection_data:
                return msg, False

        return None, True