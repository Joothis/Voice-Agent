import requests
import json
import os
from dotenv import load_dotenv
import time
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Get the n8n webhook URL from .env
base_webhook_url = os.getenv("N8N_WEBHOOK_URL")
if not base_webhook_url:
    print("Error: N8N_WEBHOOK_URL not found in .env file")
    exit(1)

# Create the WhatsApp notification webhook URL
webhook_url = base_webhook_url.replace("voice-agent", "appointment-notification")
print(f"Using webhook URL: {webhook_url}")

# Test data for different notification types
test_data = [
    {
        "type": "appointment_created",
        "appointmentId": "test-appointment-id",
        "userId": "test-user-id",
        "data": {
            "date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
            "time": "14:00",
            "type": "Initial Consultation",
            "status": "scheduled"
        }
    },
    {
        "type": "appointment_reminder",
        "appointmentId": "test-appointment-id",
        "userId": "test-user-id",
        "data": {
            "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "time": "10:30",
            "type": "Follow-up",
            "status": "scheduled"
        }
    }
]

# Test each notification type
for data in test_data:
    print(f"\nTesting {data['type']} notification...")
    print(f"Sending data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(webhook_url, json=data, timeout=10)
        
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"Error response: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Wait a bit between requests
    time.sleep(1)

print("\nAll tests completed!")
