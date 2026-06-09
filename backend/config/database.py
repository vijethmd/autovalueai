import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.autovalue_ai

users_collection = db.get_collection("users")
predictions_collection = db.get_collection("predictions")
metrics_collection = db.get_collection("model_metrics")