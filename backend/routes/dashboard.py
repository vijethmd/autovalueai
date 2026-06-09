from fastapi import APIRouter, Depends
from backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard Aggregations"])

@router.get("")
async def get_dashboard_metrics(current_user: dict = Depends(get_current_user)):
    # Completely stateless dashboard response
    return {
        "status": "Privacy Mode Active",
        "data_persistence": "Disabled (Zero-Log)",
        "active_models": 8,
        "best_performing_model": "XGBoost Regressor"
    }