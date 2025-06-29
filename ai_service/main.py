from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
model = joblib.load('anomaly_model.joblib')

class ThreatData(BaseModel):
    risk_score: float

@app.post('/predict')
def predict(data: ThreatData):
    X = np.array([[data.risk_score]])
    pred = model.predict(X)
    result = 'anomaly' if pred[0] == -1 else 'normal'
    return {'result': result} 