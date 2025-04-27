# WhatsApp Appointment Notifications

This document explains how to set up and use the WhatsApp appointment notification system for the Voice Agent application.

## Overview

The WhatsApp notification system sends appointment confirmations and reminders to users via WhatsApp. It integrates with the existing Voice Agent workflow to provide a seamless experience for users.

## Setup Instructions

### Prerequisites

- n8n installed and running
- WhatsApp Business API account
- MongoDB database configured

### WhatsApp Business API Setup

1. Create a WhatsApp Business account at [Facebook Business Manager](https://business.facebook.com/)
2. Set up the WhatsApp Business API
3. Create a WhatsApp app in the Facebook Developer Portal
4. Generate access tokens for the WhatsApp API
5. Configure the WhatsApp credentials in n8n

### Importing the Workflow

1. Open the n8n editor
2. Click on "Workflows" in the sidebar
3. Click "Import from File"
4. Select the `workflows/whatsapp-appointment-notification.json` file
5. Click "Import"

## Workflow Structure

The WhatsApp notification workflow consists of the following components:

1. **Webhook Trigger**
   - Listens for incoming requests from the Voice Agent workflow
   - Path: `/webhook/appointment-notification`

2. **Intent Processing**
   - Branches based on the notification type (confirmation, reminder)
   - Each branch handles a specific type of notification

3. **Data Retrieval**
   - Fetches appointment details from MongoDB
   - Fetches user details from MongoDB

4. **WhatsApp Messaging**
   - Sends formatted WhatsApp messages to users
   - Customizes the message content based on the notification type

5. **Webhook Response**
   - Sends a response back to the Voice Agent workflow

## Integration with Voice Agent Workflow

The Voice Agent workflow has been updated to trigger WhatsApp notifications when:

1. A new appointment is created
2. An appointment is rescheduled
3. An appointment reminder needs to be sent

## Message Templates

### Appointment Confirmation

```
🗓️ *Appointment Confirmation* 🗓️

Hello [User Name],

Your appointment has been successfully scheduled!

*Details:*
📅 Date: [Appointment Date]
⏰ Time: [Appointment Time]
📝 Type: [Appointment Type]

We look forward to seeing you!

If you need to reschedule or cancel, please contact us or use our voice assistant.
```

### Appointment Reminder

```
🔔 *Appointment Reminder* 🔔

Hello [User Name],

This is a friendly reminder about your upcoming appointment:

*Details:*
📅 Date: [Appointment Date]
⏰ Time: [Appointment Time]
📝 Type: [Appointment Type]

We look forward to seeing you!

If you need to reschedule or cancel, please contact us or use our voice assistant.
```

## Testing the Workflow

You can test the workflow by:

1. Making sure n8n is running
2. Using the Voice Agent to book an appointment
3. Checking the n8n execution log to see the workflow in action
4. Verifying that the WhatsApp message is sent to the user

## Customizing the Workflow

You can customize the workflow by:

1. Modifying the WhatsApp message templates
2. Adding more notification types
3. Changing the timing of reminders
4. Adding additional data to the messages

## Troubleshooting

If you encounter issues:

1. Check that n8n is running
2. Verify the webhook URL in your `.env` file matches the n8n webhook path
3. Check the n8n logs for any errors
4. Ensure MongoDB is accessible
5. Verify that the WhatsApp Business API credentials are correct
