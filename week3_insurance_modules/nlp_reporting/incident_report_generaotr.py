import json
from datetime import datetime

def load_template():
    with open("templates/report_template.txt", "r") as f:
        return f.read()

def generate_report(incident):
    template = load_template()
    return template.format(
        org=incident['organization'],
        date=datetime.now().strftime("%Y-%m-%d"),
        summary=incident['summary'],
        impact=incident['impact']
    )

with open("sample_incident_data.json", "r") as f:
    data = json.load(f)
    report = generate_report(data)
    with open("generated_report.txt", "w") as out:
        out.write(report)
