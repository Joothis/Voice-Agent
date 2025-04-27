import requests
import json
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Get the n8n webhook URL from .env
webhook_url = os.getenv("N8N_WEBHOOK_URL")

if not webhook_url:
    print("Error: N8N_WEBHOOK_URL not found in .env file")
    exit(1)

print(f"Using webhook URL: {webhook_url}")

# Test data for different intents
test_data = [
    {
        "intent": "booking",
        "userId": "test-user",
        "text": "I want to book an appointment for tomorrow at 2pm"
    },
    {
        "intent": "cancel",
        "userId": "test-user",
        "text": "I need to cancel my appointment"
    },
    {
        "intent": "reschedule",
        "userId": "test-user",
        "text": "Can I reschedule my appointment to Friday?"
    }
]

# Test each intent
for data in test_data:
    print(f"\nTesting {data['intent']} intent...")
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
