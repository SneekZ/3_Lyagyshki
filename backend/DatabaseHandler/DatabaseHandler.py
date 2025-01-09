from backend.DatabaseHandler.config import create_session, LPUData, mapper


class DatabaseHandler:

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

