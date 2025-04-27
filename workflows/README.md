# n8n Workflows

This directory contains n8n workflow configurations for the Voice Agent application.

## Workflows

### Voice Agent Workflow

This workflow handles the processing of voice commands from the frontend application:

- Receives webhook calls from the backend
- Processes different intents (booking, cancellation, rescheduling)
- Sends email notifications
- Updates the MongoDB database

## Setup Instructions

1. Install n8n globally: `npm install n8n -g`
2. Start n8n: `n8n start`
3. Access the n8n editor at: http://localhost:5678
4. Import the workflow JSON files from this directory

## Webhook URLs

The main webhook URL for the Voice Agent workflow is:
`http://localhost:5678/webhook/voice-agent`

This URL should be configured in your `.env` file as `N8N_WEBHOOK_URL`.
