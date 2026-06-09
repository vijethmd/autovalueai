# AutoValue AI – Production Implementation Instructions

Production SaaS ecosystem architecture engine mapping 8 parallel machine learning pipelines for evaluating used automobile prices against the custom classic CarDekho dataset matrix arrays.

## Core Prerequisites & System Dependencies
* Production Engine Runtime Environment: Node.js (v18+) & Python (v3.10+)
* Data Layer System Instance Store: MongoDB Instance running locally on default port 27017

## Verification & Rapid Start

### Phase 1: Machine Learning Asset Generation Pipeline
1. Run the script cells located in `notebooks/training.ipynb` inside a Google Colab notebook environment.
2. This creates a directory structured as `trained_models/` containing the required binary serialized assets:
   * 8 model files (`linear.pkl`, `ridge.pkl`, `lasso.pkl`, etc.)
   * `scaler.pkl`
   * `feature_columns.pkl`
   * `model_metrics.json`
3. Download these outputs and move them into the `backend/trained_models/` runtime processing folder.

### Phase 2: Core API FastAPI Engine Assembly
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or use venv\Scripts\activate if executing on Windows architecture
pip install -r requirements.txt
python main.py