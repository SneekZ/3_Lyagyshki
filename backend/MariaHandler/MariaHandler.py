from sqlalchemy import create_engine, union_all, select, and_, not_, func, Null
from sqlalchemy.orm import sessionmaker

from backend.MariaHandler.config import *
from backend.MariaHandler.settings import DATABASE_ENGINE, CHECK_ERRORS

from backend.DatabaseHandler.DatabaseHandler import DatabaseHandler
from backend.Utils.decryptor import decrypt_password, encrypt_password


class MariaHandler:

    def __init__(self, connection_data: dict):
        error, ok = self._check_connection_data(connection_data)
        if not ok:
            raise ConnectionError(error)
        self.engine_main = create_engine(DATABASE_ENGINE + f"{connection_data['dbuser']}:{connection_data['dbpassword']}@{connection_data['dbhost']}:{connection_data['dbport']}/{connection_data['database']}")
        self.engine_logger = create_engine(DATABASE_ENGINE + f"{connection_data['dbuser']}:{connection_data['dbpassword']}@{connection_data['dbhost']}:{connection_data['dbport']}/{connection_data['logger']}")

    def _session_maker_main(self):
        Session = sessionmaker(bind=self.engine_main)
        session = Session()
        return session

    def _session_maker_logger(self):
        Session = sessionmaker(bind=self.engine_logger)
        session = Session()
        return session

    def _get_person_by_id(self, id: int | str) -> (Person | str, bool):
        session = self._session_maker_main()
        person = session.query(Person).filter(
            Person.id == id,
            Person.retireDate == None,
            Person.retired == 0,
            Person.deleted == 0
        ).first()
        session.close()
        if isinstance(person, Person):
            return person, True
        return f"Врач с id = {id} не был найден", False

    def _get_person_by_snils(self, snils: int | str) -> (Person | str, bool):
        session = self._session_maker_main()
        person = session.query(Person).filter(
            Person.retireDate == None,
            Person.retired == 0,
            Person.deleted == 0,
            Person.SNILS == snils
        ).first()
        session.close()
        if isinstance(person, Person):
            return person, True
        return f"Врач со СНИЛС = {snils} не был найден", False

    def get_event_exec_person_by_id(self, id: int | str) -> (Event | str, bool):
        session = self._session_maker_main()
        query = select(
            Event.execPerson_id,
                       ).filter(
            Event.id == id,
            Event.deleted == 0
        )
        person_id = session.execute(query).first()
        session.close()

        if not person_id:
            return f"Случай с id = {id} не был найден", False
        if not person_id[0]:
            return f"Исполнитель не заполнен в случае с id = {id}", False

        return person_id[0], True

    def _get_action_by_id(self, id: int | str) -> (Action | str, bool):
        session = self._session_maker_main()
        action = session.query(Action).filter(
            Action.id == id,
            Action.deleted == 0
        ).first()
        session.close()
        if isinstance(action, Action):
            return action, True
        return f"Action с id = {id} не был найден", False

    def get_signed_by_event_id(self, event_id: int | str) -> (list[SignedIEMKDocument] | str, bool):
        session = self._session_maker_main()
        query = select(
            SignedIEMKDocument.event_id,
            SignedIEMKDocument.person_id,
            SignedIEMKDocument.sign_date.isnot(None),
            SignedIEMKDocument.document_code
            ).filter(
            SignedIEMKDocument.event_id == event_id,
            SignedIEMKDocument.deleted == 0
            )
        signed = session.execute(query).all()
        session.close()

        if not signed:
            return f"Подписанные документы на случай с id = {event_id} не были найдены", False

        mapper = ("event_id", "person_id", "signed", "document_code")
        signed = list(map(lambda x: dict(zip(mapper, x)), signed))

        return signed, True

    def get_eventlog_by_event_id(self, event_id: int | str) -> (list[IEMKEventLog] | str, bool):
        session = self._session_maker_logger()
        query = select(
            IEMKEventLog.event_id,
            IEMKEventLog.status,
            IEMKEventLog.error_message,
            IEMKEventLog.method,
        ).filter(
            IEMKEventLog.event_id == event_id
        ).order_by(
            IEMKEventLog.id.desc()
        )
        eventlog = session.execute(query).all()
        session.close()

        if not eventlog:
            return f"Попытки отправки на случай с id = {event_id} не были найдены", False

        mapper = ("event_id", "status", "error_message", "method")
        eventlog = list(map(lambda x: dict(zip(mapper, x)), eventlog))

        return eventlog, True

    def get_documents_by_event_id(self, event_id: int | str) -> (list[dict] | str, bool):
        session = self._session_maker_main()
        query1 = (
            select(
                Event.id.label('event_id'),
                Event.client_id.label('client_id'),
                Event.execPerson_id.label('person_id'),
                RbIEMKDocument.EGISZ_code.label('doc_oid'),
                RbPrintTemplate.id.label('template_id'),
                RbIEMKDocument.name.label('name')
            )
            .join(EventType, and_(EventType.id == Event.eventType_id, EventType.IEMKSend == 0))
            .join(RbPrintTemplate, and_(
                RbPrintTemplate.context == EventType.context,
                RbPrintTemplate.deleted == 0
            ))
            .join(RbIEMKDocument, and_(
                RbIEMKDocument.id == RbPrintTemplate.documentType_id,
                RbIEMKDocument.EGISZ_code.isnot(None),
                not_(RbIEMKDocument.EGISZ_code.op('REGEXP')('SMSV'))
            ))
            .where(Event.id == event_id)
        )

        query2 = (
            select(
                Action.event_id.label('event_id'),
                Event.client_id.label('client_id'),
                # Action.id.label('action_id'),
                Action.person_id.label('person_id'),
                RbIEMKDocument.EGISZ_code.label('doc_oid'),
                RbPrintTemplate.id.label('template_id'),
                RbIEMKDocument.name.label('name')
            )
            .join(Event, Event.id == Action.event_id)
            .join(ActionType, ActionType.id == Action.actionType_id)
            .join(RbPrintTemplate, RbPrintTemplate.context == ActionType.context)
            .join(RbIEMKDocument, and_(
                RbIEMKDocument.id == RbPrintTemplate.documentType_id,
                RbIEMKDocument.EGISZ_code.isnot(None),
                not_(RbIEMKDocument.EGISZ_code.op('REGEXP')('SMSV'))
            ))
            .where(Action.event_id == event_id)
        )

        query = query1.union(query2)

        documents = session.execute(query).all()
        if not documents:
            return f"Документы по случаю с id = {event_id} не были найдены", False

        mapper = ("event_id", "client_id", "person_id", "doc_oid", "template_id", "template_name")
        documents = list(map(lambda x: dict(zip(mapper, x)), documents))

        return documents, True

    def get_person_password_by_id(self, person_id: int | str) -> (str, bool):
        session = self._session_maker_main()
        query = select(
            Person.ecp_password,
        ).filter(
            Person.id == person_id
        )
        encrypted_password = session.execute(query).first()
        session.close()

        if not encrypted_password:
            return f"Врача с id = {person_id} не существует", False

        decrypted_password = decrypt_password(*encrypted_password)

        return decrypted_password, True

    def get_person_password_by_snils(self, snils: int | str) -> (str, bool):
        session = self._session_maker_main()
        query = select(
            Person.ecp_password,
        ).filter(
            Person.SNILS == snils,
            Person.retired == 0,
            Person.retireDate == None,
            Person.deleted == 0
        )
        encrypted_password = session.execute(query).first()
        session.close()

        if not encrypted_password or encrypt_password == ('', ):
            return f"Врача с СНИЛС = {snils} не существует", False

        decrypted_password = decrypt_password(*encrypted_password)

        return decrypted_password, True

    def set_person_password_by_id(self, person_id: int | str, decrypted_password: int | str) -> (str, bool):
        session = self._session_maker_main()

        encrypted_password = encrypt_password(decrypted_password)

        try:
            session.query(Person).filter(Person.id == person_id).update(
                {Person.ecp_password: encrypted_password}
            )
            session.commit()
            session.close()
            return "Успешно", True

        except Exception as e:
            return str(e), False

    def get_person_snils_by_id(self, person_id: int | str) -> (str, bool):
        session = self._session_maker_main()
        query = select(
            Person.SNILS,
        ).filter(
            Person.id == person_id
        )
        snils = session.execute(query).first()
        session.close()

        if not snils or snils == ('',):
            return f"Врача с id = {person_id} не существует", False

        return *snils, True


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


if __name__ == "__main__":
    dbh = DatabaseHandler()
    data = dbh.get_lpu(33)[0]
    mh = MariaHandler(data)
    print(type(mh.get_signed_by_event_id(590325)[0][0]))


