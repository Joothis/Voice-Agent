from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import motor.motor_asyncio
import openai
import json
import os
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client.voice_agent_db

# OpenAI configuration
openai.api_key = os.getenv("OPENAI_API_KEY")

# Models
class VoiceInput(BaseModel):
    text: str
    userId: Optional[str] = None

class Appointment(BaseModel):
    userId: str
    date: datetime
    time: str
    type: str
    status: str = "scheduled"
    created_at: datetime = datetime.now()

# Helper function for LLM processing
async def process_with_llm(text: str) -> dict:
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI assistant helping with appointment scheduling."},
                {"role": "user", "content": text}
            ],
            temperature=0.7,
            max_tokens=150
        )

        # Extract intent and entities from response
        result = response.choices[0].message.content

        # Parse the response to determine intent
        intent = "unknown"
        if "book" in text.lower() or "schedule" in text.lower():
            intent = "booking"
        elif "cancel" in text.lower():
            intent = "cancel"
        elif "reschedule" in text.lower():
            intent = "reschedule"

        return {
            "intent": intent,
            "response": result,
            "confidence": 0.9
        }
    except Exception as e:
        print(f"Error processing with LLM: {e}")
        return {
            "intent": "unknown",
            "response": "I'm sorry, I couldn't process that request.",
            "confidence": 0.0
        }

# n8n webhook handler
async def trigger_n8n_workflow(workflow_data: dict):
    try:
        webhook_url = os.getenv("N8N_WEBHOOK_URL")
        if not webhook_url:
            print("N8N_WEBHOOK_URL not configured in environment variables")
            return None

        print(f"Triggering n8n workflow at {webhook_url} with data: {workflow_data}")

        async with httpx.AsyncClient() as client:
            response = await client.post(webhook_url, json=workflow_data, timeout=10.0)

            if response.status_code != 200:
                print(f"n8n webhook returned non-200 status code: {response.status_code}, {response.text}")
                return None

            print(f"n8n workflow triggered successfully: {response.status_code}")
            return response.json()
    except httpx.TimeoutException:
        print(f"Timeout while triggering n8n workflow at {webhook_url}")
        return None
    except Exception as e:
        print(f"Error triggering n8n workflow: {e}")
        return None

# API Routes
@app.post("/process-voice")
async def process_voice(input: VoiceInput):
    try:
        # Process with LLM
        llm_result = await process_with_llm(input.text)

        # Store in MongoDB
        await db.conversations.insert_one({
            "userId": input.userId,
            "text": input.text,
            "intent": llm_result["intent"],
            "timestamp": datetime.now()
        })

        # Trigger n8n workflow if needed
        if llm_result["intent"] in ["booking", "cancel", "reschedule"]:
            await trigger_n8n_workflow({
                "intent": llm_result["intent"],
                "userId": input.userId,
                "text": input.text
            })

        return llm_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/appointments")
async def create_appointment(appointment: Appointment):
    try:
        result = await db.appointments.insert_one(appointment.model_dump())

        # Trigger n8n workflow for appointment confirmation
        await trigger_n8n_workflow({
            "type": "appointment_created",
            "appointmentId": str(result.inserted_id),
            "userId": appointment.userId
        })

        return {"id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/appointments/{user_id}")
async def get_appointments(user_id: str):
    try:
        appointments = await db.appointments.find({"userId": user_id}).to_list(length=100)
        return appointments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)