/**
 * This script helps you set up WhatsApp credentials in n8n
 * Run this script with Node.js after filling in your WhatsApp API credentials
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to generate a random ID
function generateId(length = 16) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

// Function to ask questions
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Main function
async function setupWhatsAppCredentials() {
  console.log('WhatsApp Credentials Setup for n8n');
  console.log('==================================');
  console.log('This script will help you set up WhatsApp credentials for your n8n instance.');
  console.log('You will need your WhatsApp Business API credentials from Facebook Business Manager.');
  console.log('\n');

  // Get WhatsApp API credentials
  const phoneNumberId = await askQuestion('Enter your WhatsApp Phone Number ID: ');
  const accessToken = await askQuestion('Enter your WhatsApp API Access Token: ');
  const businessAccountId = await askQuestion('Enter your WhatsApp Business Account ID: ');
  
  // Generate credential IDs
  const whatsAppApiId = generateId();
  const whatsAppTriggerId = generateId();
  
  // Create credential objects
  const whatsAppApiCredential = {
    id: whatsAppApiId,
    name: "WhatsApp Account",
    data: {
      phoneNumberId,
      accessToken
    },
    type: "whatsAppApi",
    nodesAccess: []
  };
  
  const whatsAppTriggerCredential = {
    id: whatsAppTriggerId,
    name: "WhatsApp OAuth account",
    data: {
      clientId: businessAccountId,
      accessToken
    },
    type: "whatsAppTriggerApi",
    nodesAccess: []
  };
  
  // Create credentials directory if it doesn't exist
  const credentialsDir = path.join(process.env.HOME || process.env.USERPROFILE, '.n8n', 'credentials');
  if (!fs.existsSync(credentialsDir)) {
    fs.mkdirSync(credentialsDir, { recursive: true });
  }
  
  // Write credential files
  fs.writeFileSync(
    path.join(credentialsDir, `${whatsAppApiId}.json`),
    JSON.stringify(whatsAppApiCredential, null, 2)
  );
  
  fs.writeFileSync(
    path.join(credentialsDir, `${whatsAppTriggerId}.json`),
    JSON.stringify(whatsAppTriggerCredential, null, 2)
  );
  
  console.log('\n');
  console.log('WhatsApp credentials have been set up successfully!');
  console.log(`WhatsApp API Credential ID: ${whatsAppApiId}`);
  console.log(`WhatsApp Trigger Credential ID: ${whatsAppTriggerId}`);
  console.log('\n');
  console.log('Please update your workflow files with these credential IDs:');
  console.log('1. Open workflows/whatsapp-appointment-notification.json');
  console.log('2. Replace "whatsapp-credential" with your WhatsApp API Credential ID');
  console.log('3. Save the file and import it into n8n');
  console.log('\n');
  console.log('Restart n8n for the changes to take effect.');
  
  rl.close();
}

// Run the setup
setupWhatsAppCredentials().catch(console.error);
