import uvicorn
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.API.main import app
from backend.API.settings import server_args_debug

if __name__ == "__main__":
    uvicorn.run("server_debug:app", **server_args_debug)
