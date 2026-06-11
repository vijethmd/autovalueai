
import os
import json

from fastapi import APIRouter, Depends

from utils.auth import get_current_user

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics Module"]
)

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "trained_models"
)

@router.get("")
async def get_analytics(
    current_user: dict = Depends(get_current_user)
):

    metrics_path = os.path.join(
        MODEL_DIR,
        "model_metrics.json"
    )

    metrics = {}

    if os.path.exists(metrics_path):

        with open(metrics_path, "r") as f:
            metrics = json.load(f)

    best_model = None
    best_r2 = -999

    for model_name, values in metrics.items():

        r2 = values.get("R2", 0)

        if r2 > best_r2:
            best_r2 = r2
            best_model = model_name

    return {
        "currency": "INR",
        "currency_symbol": "₹",

        "active_models": len(metrics),

        "best_model": best_model,

        "best_r2_score": round(
            best_r2,
            4
        ),

        "model_performance": metrics
    }