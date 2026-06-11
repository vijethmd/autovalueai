
import os
import joblib
import numpy as np
import pandas as pd

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from utils.auth import get_current_user

router = APIRouter(
    prefix="/api",
    tags=["Prediction Engine"]
)

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "trained_models"
)

try:

    scaler = joblib.load(
        os.path.join(MODEL_DIR, "scaler.pkl")
    )

    feature_columns = joblib.load(
        os.path.join(MODEL_DIR, "feature_columns.pkl")
    )

    brand_freq = joblib.load(
        os.path.join(MODEL_DIR, "brand_freq.pkl")
    )

    model_freq = joblib.load(
        os.path.join(MODEL_DIR, "model_freq.pkl")
    )

    models = {

        "linear_regression": joblib.load(
            os.path.join(
                MODEL_DIR,
                "linear_regression.pkl"
            )
        ),

        "ridge_regression": joblib.load(
            os.path.join(
                MODEL_DIR,
                "ridge_regression.pkl"
            )
        ),

        "lasso_regression": joblib.load(
            os.path.join(
                MODEL_DIR,
                "lasso_regression.pkl"
            )
        ),

        "decision_tree": joblib.load(
            os.path.join(
                MODEL_DIR,
                "decision_tree.pkl"
            )
        ),

        "random_forest": joblib.load(
            os.path.join(
                MODEL_DIR,
                "random_forest.pkl"
            )
        ),

        "gradient_boosting": joblib.load(
            os.path.join(
                MODEL_DIR,
                "gradient_boosting.pkl"
            )
        ),

        "svr": joblib.load(
            os.path.join(
                MODEL_DIR,
                "svr.pkl"
            )
        ),

        "xgboost": joblib.load(
            os.path.join(
                MODEL_DIR,
                "xgboost.pkl"
            )
        )
    }

    print("Models loaded successfully.")
    print("Available models:", list(models.keys()))

except Exception as e:

    import traceback

    print("=" * 60)
    print("MODEL LOADING ERROR")
    traceback.print_exc()
    print("=" * 60)

    scaler = None
    feature_columns = None
    brand_freq = {}
    model_freq = {}
    models = {}


class CarDetailsSchema(BaseModel):

    Brand: str
    model_name: str

    Year: int
    Age: int

    kmDriven: int

    Transmission: str
    Owner: str
    FuelType: str

    model: str = "xgboost"

    model_config = {
        "protected_namespaces": ()
    }


def prepare_features(details: CarDetailsSchema):

    owner_value = 0

    if details.Owner.lower() == "second":
        owner_value = 1

    brand_freq_value = brand_freq.get(
        details.Brand,
        0
    )

    model_freq_value = model_freq.get(
        details.model_name,
        0
    )

    df = pd.DataFrame([{

        "Year": details.Year,

        "Age": details.Age,

        "kmDriven": details.kmDriven,

        "Owner": owner_value,

        "BrandFreq": brand_freq_value,

        "ModelFreq": model_freq_value,

        "AgeSquared":
            details.Age ** 2,

        "MileagePerYear":
            details.kmDriven /
            (details.Age + 1),

        "Brand":
            details.Brand,

        "model":
            details.model_name,

        "Transmission":
            details.Transmission,

        "FuelType":
            details.FuelType
    }])

    df = pd.get_dummies(
        df,
        columns=[
            "Brand",
            "model",
            "Transmission",
            "FuelType"
        ],
        drop_first=True
    )

    df = df.reindex(
        columns=feature_columns,
        fill_value=0
    )

    return df


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

        prediction_log = (
            models[model_key]
            .predict(
                scaler.transform(features)
            )[0]
        )

    else:

        prediction_log = (
            models[model_key]
            .predict(
                features
            )[0]
        )

    prediction = np.expm1(
        prediction_log
    )

    return round(
        float(prediction),
        2
    )


@router.post("/predict")
async def predict_car_price(
    payload: CarDetailsSchema,
    current_user: dict = Depends(
        get_current_user
    )
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


@router.post("/compare-models")
async def compare_models(
    payload: CarDetailsSchema,
    current_user: dict = Depends(
        get_current_user
    )
):

    results = {}

    for model_name in models.keys():

        try:

            results[
                model_name
            ] = pipeline_inference(
                payload,
                model_name
            )

        except Exception as e:

            print(
                model_name,
                "failed:",
                str(e)
            )

            results[
                model_name
            ] = 0

    return results

