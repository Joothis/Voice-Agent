# Voice Agent with n8n Workflows

A voice-enabled assistant application that processes natural language input, schedules appointments, and sends notifications via email and WhatsApp.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [n8n Workflows](#n8n-workflows)
- [WhatsApp Integration](#whatsapp-integration)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## Overview

This application provides a voice-enabled assistant that can understand natural language requests, process them using AI, and perform actions like scheduling, rescheduling, or canceling appointments. It integrates with n8n for workflow automation and includes WhatsApp notifications for appointment confirmations and reminders.

## Features

- **Voice Recognition**: Processes spoken commands and converts them to text
- **Natural Language Processing**: Uses OpenAI to understand user intent
- **Appointment Management**: Schedule, reschedule, and cancel appointments
- **Multi-channel Notifications**: Send confirmations and reminders via:
  - Email
  - WhatsApp
- **Workflow Automation**: Uses n8n for backend process automation
- **MongoDB Integration**: Stores conversation history and appointment data

## System Architecture

The system consists of the following components:

1. **Frontend**: React-based UI for voice interaction
2. **Backend API**: FastAPI server that processes requests and manages data
3. **n8n Workflows**: Automation workflows for notifications and data processing
4. **MongoDB**: Database for storing user data and appointments
5. **OpenAI Integration**: For natural language understanding
6. **WhatsApp Business API**: For sending WhatsApp notifications

## Prerequisites

- Node.js (v14+)
- Python 3.8+
- MongoDB
- n8n (installed globally)
- WhatsApp Business API account (for WhatsApp notifications)
- OpenAI API key

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/joothis/Voice-Agent.git
cd Voice-Agent
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Install n8n globally

```bash
npm install n8n -g
```

## Configuration

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URL=<your-mongodb-connection-string>
OPENAI_API_KEY=<your-openai-api-key>
N8N_WEBHOOK_URL=http://localhost:5678/webhook/voice-agent
```

### 2. WhatsApp Business API Setup

To use WhatsApp notifications:

1. Create a WhatsApp Business account at [Facebook Business Manager](https://business.facebook.com/)
2. Set up the WhatsApp Business API
3. Create a WhatsApp app in the Facebook Developer Portal
4. Generate access tokens for the WhatsApp API
5. Run the setup script to configure n8n credentials:

```bash
node setup-whatsapp-credentials.js
```

## Running the Application

### 1. Start all services with a single command

```bash
npm run start-services
```

This will start:
- n8n server on port 5678
- Backend API on port 8000
- Open the n8n editor in your browser

### 2. Or start services individually

Start n8n:
```bash
npm run n8n
```

Start the backend:
```bash
npm run backend
```

Start the frontend:
```bash
npm run dev
```

## n8n Workflows

The application uses two main n8n workflows:

### 1. Voice Agent Workflow

This workflow processes the intents from the voice agent and triggers appropriate actions:

- **Webhook Trigger**: Receives data from the backend
- **Intent Processing**: Routes based on intent (booking, cancel, reschedule)
- **Email Notifications**: Sends confirmation emails
- **WhatsApp Trigger**: Initiates WhatsApp notifications

To import:
1. Open n8n (http://localhost:5678)
2. Go to Workflows
3. Click Import from File
4. Select `workflows/voice-agent-workflow.json`

### 2. WhatsApp Notification Workflow

This workflow handles sending WhatsApp notifications for appointments:

- **Webhook Trigger**: Receives notification requests
- **Data Retrieval**: Fetches appointment and user details
- **Message Formatting**: Creates personalized messages
- **WhatsApp Sending**: Delivers messages to users

To import:
1. Open n8n (http://localhost:5678)
2. Go to Workflows
3. Click Import from File
4. Select `workflows/whatsapp-appointment-notification.json`

## WhatsApp Integration

The application can send two types of WhatsApp notifications:

1. **Appointment Confirmations**: Sent when a new appointment is created
2. **Appointment Reminders**: Sent before an upcoming appointment

Message templates are customizable in the n8n workflow.

### Testing WhatsApp Notifications

Use the provided test script:

```bash
python test-whatsapp-notification.py
```

## API Documentation

The backend API provides the following endpoints:

### Process Voice Input

```
POST /process-voice
```

Request body:
```json
{
  "text": "I want to book an appointment for tomorrow at 2pm",
  "userId": "user123"
}
```

### Create Appointment

```
POST /appointments
```

Request body:
```json
{
  "userId": "user123",
  "date": "2023-06-15T00:00:00.000Z",
  "time": "14:00",
  "type": "consultation",
  "status": "scheduled"
}
```

### Get User Appointments

```
GET /appointments/{user_id}
```

## Troubleshooting

### n8n Connection Issues

If the backend can't connect to n8n:

1. Check that n8n is running (`npm run n8n`)
2. Verify the webhook URL in your `.env` file
3. Check n8n logs for any errors

### WhatsApp Notification Issues

If WhatsApp notifications aren't being sent:

1. Verify your WhatsApp Business API credentials
2. Check that both n8n workflows are active
3. Run the test script to diagnose issues

### MongoDB Connection Issues

If the application can't connect to MongoDB:

1. Check your MongoDB connection string in `.env`
2. Ensure MongoDB is running
3. Check network connectivity and firewall settings

## Additional Documentation

For more detailed information, see:

- [n8n Workflow Documentation](docs/n8n-workflow.md)
- [WhatsApp Notifications Guide](docs/whatsapp-notifications.md)
