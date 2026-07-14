import joblib
import pandas as pd

# Load model
model = joblib.load("backend/crop_model.pkl")

# Example input
data = pd.DataFrame([{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.8,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.9
}])

prediction = model.predict(data)

print("Recommended Crop:", prediction[0])