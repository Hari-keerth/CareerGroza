import json
import os
import uuid

import requests
from dotenv import load_dotenv

load_dotenv()

LANGFLOW_URL = os.getenv("LANGFLOW_URL")
FLOW_ID = os.getenv("LANGFLOW_ATS_FLOW_ID")
API_KEY = os.getenv("LANGFLOW_API_KEY")


def analyze_resume(resume_text, job_description):
    combined_input = f"""
=========================
RESUME
=========================

{resume_text}

=========================
JOB DESCRIPTION
=========================

{job_description}
"""

    payload = {
        "input_value": combined_input,
        "input_type": "chat",
        "output_type": "chat",
        "session_id": str(uuid.uuid4()),
    }

    headers = {
        "x-api-key": API_KEY,
    }

    response = requests.post(
        f"{LANGFLOW_URL}/api/v1/run/{FLOW_ID}",
        json=payload,
        headers=headers,
        timeout=180,
    )

    response.raise_for_status()

    data = response.json()

    ai_response = data["outputs"][0]["outputs"][0]["results"]["message"]["text"]

    return json.loads(ai_response)