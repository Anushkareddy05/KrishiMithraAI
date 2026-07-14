import requests

API_KEY = "91050d0db7438126ab3c6ef6c3569c73"

city = "Kadapa"

url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={API_KEY}&units=metric"

response = requests.get(url)

print(response.json())