# n8n Workflow for Voice Agent

This document explains how to set up and use the n8n workflow for the Voice Agent application.

## Overview

The n8n workflow handles the backend processing of voice commands from the frontend application. It processes different intents (booking, cancellation, rescheduling) and performs actions like sending email notifications and updating the database.

## Setup Instructions

### Prerequisites

- Node.js installed
- n8n installed globally: `npm install n8n -g`
- MongoDB running locally or accessible via connection string

### Starting the Services

You can start all services (n8n and backend) together using:

```bash
npm run start-services
```

Or start them individually:

1. Start n8n: `npm run n8n` or `n8n start`
2. Start backend: `npm run backend`

### Accessing n8n

Once n8n is running, you can access the editor at:
http://localhost:5678

### Importing the Workflow

1. Open the n8n editor
2. Click on "Workflows" in the sidebar
3. Click "Import from File"
4. Select the `workflows/voice-agent-workflow.json` file
5. Click "Import"

## Workflow Structure

The workflow consists of the following components:

1. **Webhook Trigger**
   - Listens for incoming requests from the backend
   - Path: `/webhook/voice-agent`

2. **Intent Processing**
   - Branches based on the intent (booking, cancel, reschedule)
   - Each branch handles a specific type of request

3. **Email Notifications**
   - Sends confirmation emails for each action
   - Customizes the email content based on the intent

4. **Data Processing**
   - Prepares data for response
   - Could be extended to update MongoDB directly

5. **Webhook Response**
   - Sends a response back to the backend

## Testing the Workflow

You can test the workflow by:

1. Making sure n8n is running
2. Using the Voice Agent frontend to make requests
3. Checking the n8n execution log to see the workflow in action

## Customizing the Workflow

You can customize the workflow by:

1. Adding more nodes for additional functionality
2. Modifying the email templates
3. Adding direct database integration
4. Adding error handling and notifications

## Troubleshooting

If you encounter issues:

1. Check that n8n is running
2. Verify the webhook URL in your `.env` file matches the n8n webhook path
3. Check the n8n logs for any errors
4. Ensure MongoDB is accessible if using database nodes
