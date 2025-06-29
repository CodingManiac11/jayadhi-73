import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# Simulate many normal scores and a few anomalies
normal_scores = [10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 25, 30, 35, 40] * 10  # 150 normal
anomaly_scores = [60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 400, 500] * 1      # 12 anomalies
data = pd.DataFrame({'risk_score': normal_scores + anomaly_scores})

model = IsolationForest(contamination=0.07, random_state=42)  # 7% anomalies
model.fit(data)

joblib.dump(model, 'anomaly_model.joblib') 