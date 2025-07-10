import pandas as pd

def calculate_risk_score(row):
    score = 0
    if row['num_incidents'] > 5:
        score += 30
    if row['incident_severity'] == 'high':
        score += 50
    score += int(row['unpatched_vulnerabilities']) * 2
    return score

def run_risk_model(csv_path):
    df = pd.read_csv(csv_path)
    df['risk_score'] = df.apply(calculate_risk_score, axis=1)
    df.to_csv("risk_scored_output.csv", index=False)
