import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# ----------------------------
# Paths
# ----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "yield_prediction",
    "yield_df.csv"
)

MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "yield_model.pkl")

# ----------------------------
# Load dataset
# ----------------------------
df = pd.read_csv(DATA_PATH)

print("Dataset Loaded Successfully!")
print(df.head())

# ----------------------------
# Features and Target
# ----------------------------
X = df.drop("hg/ha_yield", axis=1)
y = df["hg/ha_yield"]

# Categorical and Numerical columns
categorical = ["Area", "Item"]
numerical = [
    "Year",
    "average_rain_fall_mm_per_year",
    "pesticides_tonnes",
    "avg_temp"
]

# ----------------------------
# Preprocessing
# ----------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
        ("num", "passthrough", numerical)
    ]
)

# ----------------------------
# Model
# ----------------------------
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# ----------------------------
# Split data
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# ----------------------------
# Train
# ----------------------------
print("Training started...")

pipeline.fit(X_train, y_train)

print("Training completed!")

# ----------------------------
# Test Accuracy
# ----------------------------
predictions = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, predictions)

print(f"Mean Absolute Error: {mae}")

# ----------------------------
# Save Model
# ----------------------------
joblib.dump(pipeline, MODEL_PATH)

print(f"Model saved at: {MODEL_PATH}")