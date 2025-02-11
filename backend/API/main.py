from backend.API.config import app
from backend.API.routes import document, logger, password, event, signs, lpu, utils, license, container, person

app.include_router(document.router, prefix="", tags=["Documents"])
app.include_router(logger.router, prefix="", tags=["Logger"])
app.include_router(password.router, prefix="", tags=["Password"])
app.include_router(event.router, prefix="", tags=["Event"])
app.include_router(signs.router, prefix="", tags=["Signs"])
app.include_router(lpu.router, prefix="", tags=["LpuData"])
app.include_router(utils.router, prefix="", tags=["Utils"])
app.include_router(license.router, prefix="", tags=["License"])
app.include_router(container.router, prefix="", tags=["Container"])
app.include_router(person.router, prefix="", tags=["Person"])