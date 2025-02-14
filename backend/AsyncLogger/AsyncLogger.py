import aiosqlite
import asyncio

from backend.AsyncLogger.settings import PATH

async def write_to_log(*args) -> None:
    async with aiosqlite.connect(PATH) as db:
        await db.execute(
                            "INSERT INTO logger (user, lpu_id, action_type, snils, sha, note) VALUES (?, ?, ?, ?, ?, ?)",
                            args
                         )
        await db.commit()

def log(user: str, lpu_id: int, action_type: str, snils: str, sha: str, note: str) -> str | bool:
    try:
        asyncio.run(write_to_log(user, lpu_id, action_type, snils, sha, note))
    
    except Exception as e:
        return str(e), False
    
    return "OK", True