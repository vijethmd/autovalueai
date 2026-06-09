import os
import json
from fastapi import APIRouter, Depends
from backend.utils.auth import get_current_user

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

    return {
        "currency": "INR",
        "currency_symbol": "₹",
        "model_performance": metrics
    }