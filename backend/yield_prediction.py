import os
import joblib
import pandas as pd

# Load trained model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "yield_model.pkl")

model = joblib.load(MODEL_PATH)

def predict_yield(area, item, year, rainfall, pesticides, temperature):

    data = pd.DataFrame({
        "Area": [area],
        "Item": [item],
        "Year": [year],
        "average_rain_fall_mm_per_year": [rainfall],
        "pesticides_tonnes": [pesticides],
        "avg_temp": [temperature]
    })

    prediction = model.predict(data)

    return prediction[0]