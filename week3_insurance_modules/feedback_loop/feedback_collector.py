import json

def submit_feedback(feedback):
    with open("feedback_logs.json", "a") as f:
        f.write(json.dumps(feedback) + "\n")

feedback = {
    "module": "risk_scoring",
    "issue": "Incorrectly marked low-risk entity as high-risk",
    "correction": "Should be medium-risk"
}

submit_feedback(feedback)
