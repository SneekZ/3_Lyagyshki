from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import backend.DatabaseHandler.settings as settings


engine = create_engine(
                        settings.DATABASE_ENGINE_PATH,
                        pool_size=10,
                        max_overflow=20,
                        pool_timeout=60,
                        pool_recycle=1800
                    )

Base = declarative_base()


class LPUData(Base):
    __tablename__ = 'lpudata'

    id = Column(Integer, primary_key=True)  # PRIMARY KEY
    name = Column(String(32), nullable=False)  # VARCHAR(32)
    host = Column(String(16), nullable=False)  # VARCHAR(16)
    port = Column(Integer, nullable=False)  # INT
    user = Column(String(16), nullable=False)  # VARCHAR(16)
    password = Column(String(16), nullable=False)  # VARCHAR(16)
    dbhost = Column(String(16), nullable=False)  # VARCHAR(16)
    dbport = Column(Integer, nullable=False)  # INT
    dbuser = Column(String(16), nullable=False)  # VARCHAR(16)
    dbpassword = Column(String(16), nullable=False)  # VARCHAR(16)
    database = Column(String(16), nullable=False)  # VARCHAR(16)
    path = Column(Text, nullable=True)  # TEXT
    logger = Column(Text, nullable=True)  # TEXT
    egisz = Column(Text, nullable=True)  # TEXT

    def __repr__(self):
        return f"<LPUData(name={self.name}, host={self.host}, port={self.port}, database={self.database})>"


Base.metadata.create_all(engine)


def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


def mapper(data: LPUData) -> dict:
    return {
        "id": data.id,
        "value": data.id,
        "name": data.name,
        "label": data.name,
        "host": data.host,
        "port": data.port,
        "user": data.user,
        "password": data.password,
        "dbhost": data.dbhost,
        "dbport": data.dbport,
        "dbuser": data.dbuser,
        "dbpassword": data.dbpassword,
        "database": data.database,
        "path": data.path,
        "logger": data.logger,
        "egisz": data.egisz
    }


if __name__ == "__main__":
    sess = create_session()
    data = sess.query(LPUData).filter_by(id="1").first()
    print(mapper(data))
