from pathlib import Path

# Получаем корневую директорию проекта
BASE_DIR = Path(__file__).resolve().parent.parent

# Абсолютный путь к базе данных
path = BASE_DIR / "DatabaseHandler" / "database" / "database.db"
DATABASE_ENGINE_PATH = f"sqlite:///{path}"