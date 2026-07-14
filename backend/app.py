from flask import Flask, render_template, request, jsonify
import os
import requests
from disease_detection import predict_disease

app = Flask(__name__)

# =====================================================
# CONFIGURATION
# =====================================================

WEATHER_API_KEY = "91050d0db7438126ab3c6ef6c3569c73"

UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# =====================================================
# HOME PAGE
# =====================================================

@app.route("/")
def home():
    return render_template("index.html")


# =====================================================
# LIVE WEATHER API
# =====================================================

@app.route("/weather", methods=["GET"])
def weather():

    city = request.args.get("city")

    if not city:
        return jsonify({"error": "Please enter a city."})

    try:

        url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?q={city}&appid={WEATHER_API_KEY}&units=metric"
        )

        response = requests.get(url)
        data = response.json()

        if response.status_code != 200:
            return jsonify({"error": "City not found."})

        weather = data["weather"][0]["main"]
        description = data["weather"][0]["description"].title()

        # -------------------------
        # AI Farming Advice
        # -------------------------

        if weather.lower() == "rain":

            advice = "🌧 Rain is expected. Avoid pesticide spraying and ensure proper drainage."

        elif weather.lower() == "clear":

            advice = "☀ Good weather for irrigation and fertilizer application."

        elif weather.lower() == "clouds":

            advice = "☁ Good day for crop monitoring and field inspection."

        elif weather.lower() == "thunderstorm":

            advice = "⚠ Avoid field work until the weather improves."

        elif weather.lower() == "drizzle":

            advice = "🌦 Light rain expected. Delay spraying chemicals."

        elif weather.lower() == "mist":

            advice = "🌫 Watch for fungal diseases because of moisture."

        else:

            advice = "🌱 Weather is suitable for regular farming activities."

        return jsonify({

            "temperature": data["main"]["temp"],

            "humidity": data["main"]["humidity"],

            "condition": weather,

            "description": description,

            "wind": data["wind"]["speed"],

            "advice": advice

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


# =====================================================
# DISEASE DETECTION
# =====================================================

@app.route("/predict_disease", methods=["POST"])
def disease():

    try:

        if "image" not in request.files:

            return jsonify({

                "error": "No image uploaded."

            })

        file = request.files["image"]

        if file.filename == "":

            return jsonify({

                "error": "No image selected."

            })

        filepath = os.path.join(

            app.config["UPLOAD_FOLDER"],

            file.filename

        )

        file.save(filepath)

        result = predict_disease(filepath)

        return jsonify(result)

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


# =====================================================
# RUN
# =====================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)