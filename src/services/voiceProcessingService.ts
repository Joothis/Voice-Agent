import { AppointmentDetails } from '../types';

interface ProcessingResponse {
  message: string;
  appointmentDetails: AppointmentDetails | null;
  intent?: string;
  confidence?: number;
}

export const processVoiceInput = async (input: string): Promise<ProcessingResponse> => {
  try {
    const response = await fetch('http://localhost:8000/process-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: input,
        userId: 'test-user' // In a real app, this would be the authenticated user's ID
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process voice input');
    }

    const data = await response.json();
    
    // Convert the backend response to the frontend format
    return {
      message: data.response,
      appointmentDetails: data.intent === 'booking' || data.intent === 'reschedule' ? {
        date: new Date().toISOString(),
        time: '10:00 AM',
        type: data.intent === 'booking' ? 'new' : 'reschedule'
      } : null,
      intent: data.intent,
      confidence: data.confidence
    };
  } catch (error) {
    console.error('Error processing voice input:', error);
    return {
      message: "I'm sorry, I couldn't process that request. Could you please try again?",
      appointmentDetails: null,
      intent: 'error',
      confidence: 0
    };
  }
};