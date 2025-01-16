ORIGINS = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "http://192.168.0.67:6767",
    "http://192.168.0.67:6007"
]

server_args_debug = {
    "host": "192.168.0.67",
    "port": 52912,
    "reload": True,
    "use_colors": True,
    "workers": 4,
}

server_args_prod = {
    "host": "192.168.0.67",
    "port": 52912,
    "reload": False,
    "use_colors": True,
    "workers": 4,
}

