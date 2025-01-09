import uvicorn

from backend.API.config import app
from backend.API.routes import document, logger, password, event, signs, lpu

app.include_router(document.router, prefix="", tags=["Documents"])
app.include_router(logger.router, prefix="", tags=["Logger"])
app.include_router(password.router, prefix="", tags=["Password"])
app.include_router(event.router, prefix="", tags=["Event"])
app.include_router(signs.router, prefix="", tags=["Signs"])
app.include_router(lpu.router, prefix="", tags=["LpuData"])