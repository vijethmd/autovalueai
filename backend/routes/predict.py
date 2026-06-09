
import os
import joblib
import pandas as pd

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.utils.auth import get_current_user

router = APIRouter(
    prefix="/api",
    tags=["Prediction Engine"]
)

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "trained_models"
)

# ==========================
# LOAD ARTIFACTS
# ==========================

try:
    scaler = joblib.load(
        os.path.join(MODEL_DIR, "scaler.pkl")
    )

    feature_columns = joblib.load(
        os.path.join(MODEL_DIR, "feature_columns.pkl")
    )

    models = {
        "linear_regression": joblib.load(
            os.path.join(MODEL_DIR, "linear.pkl")
        ),
        "ridge_regression": joblib.load(
            os.path.join(MODEL_DIR, "ridge.pkl")
        ),
        "lasso_regression": joblib.load(
            os.path.join(MODEL_DIR, "lasso.pkl")
        ),
        "decision_tree": joblib.load(
            os.path.join(MODEL_DIR, "decision_tree.pkl")
        ),
        "random_forest": joblib.load(
            os.path.join(MODEL_DIR, "random_forest.pkl")
        ),
        "gradient_boosting": joblib.load(
            os.path.join(MODEL_DIR, "gradient_boosting.pkl")
        ),
        "svr": joblib.load(
            os.path.join(MODEL_DIR, "svr.pkl")
        ),
        "xgboost": joblib.load(
            os.path.join(MODEL_DIR, "xgboost.pkl")
        )
    }

    print("Models loaded successfully.")
    print("Available models:", list(models.keys()))

except Exception as e:
    print("MODEL LOADING ERROR:", str(e))

    scaler = None
    feature_columns = None
    models = {}


# ==========================
# REQUEST SCHEMA
# ==========================

class CarDetailsSchema(BaseModel):
    Car_Name: str
    Year: int
    Present_Price: float
    Kms_Driven: int
    Fuel_Type: str
    Seller_Type: str
    Transmission: str
    Owner: int
    model: str = "xgboost"

    model_config = {
        "protected_namespaces": ()
    }


# ==========================
# FEATURE PIPELINE
# ==========================

def prepare_features(details: CarDetailsSchema):

    df = pd.DataFrame([{
        "Year": details.Year,
        "Present_Price": details.Present_Price,
        "Kms_Driven": details.Kms_Driven,
        "Owner": details.Owner,
        "Fuel_Type": details.Fuel_Type,
        "Seller_Type": details.Seller_Type,
        "Transmission": details.Transmission
    }])

    df = pd.get_dummies(
        df,
        columns=[
            "Fuel_Type",
            "Seller_Type",
            "Transmission"
        ],
        drop_first=True
    )

    df = df.reindex(
        columns=feature_columns,
        fill_value=0
    )

    return df


# ==========================
# INFERENCE
# ==========================

def pipeline_inference(
    details: CarDetailsSchema,
    model_key: str
):

    features = prepare_features(details)

    scaled_models = [
        "linear_regression",
        "ridge_regression",
        "lasso_regression",
        "svr"
    ]

    if model_key in scaled_models:
        prediction = models[model_key].predict(
            scaler.transform(features)
        )[0]
    else:
        prediction = models[model_key].predict(
            features.values
        )[0]

    return round(float(prediction), 2)


# ==========================
# PREDICT
# ==========================

@router.post("/predict")
async def predict_car_price(
    payload: CarDetailsSchema,
    current_user: dict = Depends(get_current_user)
):

    if payload.model not in models:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{payload.model}' not found"
        )

    prediction = pipeline_inference(
        payload,
        payload.model
    )

    return {
        "predicted_price": prediction
    }


# ==========================
# COMPARE MODELS
# ==========================

@router.post("/compare-models")
async def compare_models(
    payload: CarDetailsSchema,
    current_user: dict = Depends(get_current_user)
):

    results = {}

    for model_name in models.keys():

        try:
            results[model_name] = pipeline_inference(
                payload,
                model_name
            )

        except Exception as e:
            print(model_name, "failed:", str(e))
            results[model_name] = 0

    return results