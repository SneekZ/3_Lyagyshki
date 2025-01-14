import subprocess, json, time

input = [
    "p17",
    "22",
    "root",
    "shedF34A"
]

start = time.time()

result = subprocess.run(['backend/GoLang/optimized.exe'] + input, text=True, capture_output=True, encoding="utf-8")

if result.returncode == 0:
    parsed_data = json.loads(result.stdout)

end = time.time()

print(*parsed_data, sep="\n")
print(len(parsed_data))
print(f"Результат: {end - start:.2f}")