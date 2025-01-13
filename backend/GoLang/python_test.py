import subprocess, json, time

input = [
    "p122vm",
    "22",
    "root",
    "shedF34A"
]

start = time.time()

result = subprocess.run(['backend/GoLang/backend.exe'] + input, text=True, capture_output=True, encoding="utf-8")

if result.returncode == 0:
    parsed_data = json.loads(result.stdout)

end = time.time()

print(*parsed_data)
print(f"Результат: {end - start:.2f}")