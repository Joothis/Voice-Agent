export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface AppointmentDetails {
  date: string;
  time: string;
  type: 'new' | 'reschedule' | 'cancel';
}