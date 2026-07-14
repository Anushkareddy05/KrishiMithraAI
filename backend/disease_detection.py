import os
import pickle
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# ---------------------------------
# Paths
# ---------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "disease_model.keras")
CLASS_PATH = os.path.join(BASE_DIR, "models", "class_names.pkl")

# ---------------------------------
# Load Model
# ---------------------------------

model = load_model(MODEL_PATH, compile=False)

with open(CLASS_PATH, "rb") as f:
    class_names = pickle.load(f)

IMAGE_SIZE = (224, 224)

# ---------------------------------
# Disease Knowledge Base
# ---------------------------------

disease_info = {

    "Bacterial spot":{

        "severity":"🟢 Mild",

        "medicine":"Copper Oxychloride 50% WP",

        "organic":"Neem Oil Spray",

        "watering":"Avoid overhead watering.",

        "prevention":[
            "Remove infected leaves",
            "Improve air circulation",
            "Avoid working with wet plants",
            "Use certified disease-free seeds"
        ],

        "spray":"Every 7–10 days",

        "recommendation":"Early infection detected. Spray Copper Oxychloride every 7–10 days and monitor the crop weekly."

    },

    "Early blight":{

        "severity":"🟡 Moderate",

        "medicine":"Mancozeb 75% WP",

        "organic":"Compost Tea Spray",

        "watering":"Water only near the roots.",

        "prevention":[
            "Remove infected leaves",
            "Rotate crops",
            "Improve drainage",
            "Avoid overcrowding"
        ],

        "spray":"Every 7 days",

        "recommendation":"Apply Mancozeb immediately to stop disease spread."

    },

    "Late blight":{

        "severity":"🔴 Severe",

        "medicine":"Metalaxyl + Mancozeb",

        "organic":"Copper-based Organic Spray",

        "watering":"Reduce irrigation frequency.",

        "prevention":[
            "Destroy infected plants",
            "Improve ventilation",
            "Avoid leaf wetness",
            "Monitor every 3 days"
        ],

        "spray":"Every 5–7 days",

        "recommendation":"Immediate fungicide application is recommended."

    },

    "Healthy":{

        "severity":"🟢 Healthy",

        "medicine":"No medicine required",

        "organic":"Continue organic compost",

        "watering":"Maintain regular watering.",

        "prevention":[
            "Monitor leaves weekly",
            "Use balanced fertilizer",
            "Maintain field hygiene"
        ],

        "spray":"Not required",

        "recommendation":"The crop appears healthy. Continue current farming practices."

    }

}
# ---------------------------------
# Prediction Function
# ---------------------------------

def predict_disease(img_path):

    try:

        img = image.load_img(img_path, target_size=IMAGE_SIZE)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        prediction = model.predict(img_array, verbose=0)

        index = np.argmax(prediction)

        confidence = float(prediction[0][index]) * 100

        predicted_class = class_names[index]

        if "___" in predicted_class:
            predicted_class = predicted_class.replace("___", "|")

        parts = predicted_class.split("|")

        crop = parts[0].replace("_", " ")

        disease = parts[1].replace("_", " ") if len(parts) > 1 else "Healthy"

        info = disease_info.get(disease, {

            "severity": "🟢 Mild",

            "medicine": "Consult Agriculture Officer",

            "organic": "Neem Oil Spray",

            "watering": "Maintain proper irrigation.",

            "prevention": [
                "Monitor crop regularly",
                "Remove infected leaves"
            ],

            "spray": "As recommended",

            "recommendation": "Further inspection is recommended."

        })

        return {

            "crop": crop,

            "disease": disease,

            "confidence": round(confidence, 2),

            "severity": info["severity"],

            "medicine": info["medicine"],

            "organic": info["organic"],

            "watering": info["watering"],

            "prevention": info["prevention"],

            "spray": info["spray"],

            "recommendation": info["recommendation"]

        }

    except Exception as e:

        return {

            "error": str(e)

        }
