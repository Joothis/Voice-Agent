import React, { useState } from 'react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { Calendar, Clock, Check, X } from 'lucide-react';
import { AppointmentDetails } from '../types';

interface AppointmentCalendarProps {
  appointmentDetails: AppointmentDetails | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM'
];

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointmentDetails,
  onConfirm,
  onCancel
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(appointmentDetails?.date 
    ? new Date(appointmentDetails.date) 
    : new Date());
  
  const [selectedTime, setSelectedTime] = useState<string>(appointmentDetails?.time || '');
  
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfDay(new Date()), i);
    return date;
  });
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Calendar className="h-4 w-4 text-secondary-600 mr-2 animate-float" />
          <h3 className="font-medium text-gray-900">Select Date</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dateOptions.map((date, index) => (
            <button
              key={date.toString()}
              className={`text-center py-2 rounded-md transition-all duration-300 transform hover:scale-110 ${
                isSameDay(date, selectedDate)
                  ? 'bg-secondary-100 text-secondary-700 font-medium shadow-md'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleDateSelect(date)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-xs text-gray-500">
                {format(date, 'EEE')}
              </div>
              <div className="text-sm font-medium">
                {format(date, 'd')}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 text-secondary-600 mr-2 animate-float" />
          <h3 className="font-medium text-gray-900">Select Time</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time, index) => (
            <button
              key={time}
              className={`py-2 px-3 text-sm rounded-md text-center transition-all duration-300 transform hover:scale-110 ${
                selectedTime === time
                  ? 'bg-secondary-100 text-secondary-700 font-medium shadow-md'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleTimeSelect(time)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-2 border-t pt-4">
        <button
          className="flex-1 flex justify-center items-center py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </button>
        <button
          className={`flex-1 flex justify-center items-center py-2 px-4 rounded-md text-white transition-all duration-300 transform hover:scale-105 ${
            selectedDate && selectedTime
              ? 'bg-success-600 hover:bg-success-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={onConfirm}
          disabled={!selectedDate || !selectedTime}
        >
          <Check className="h-4 w-4 mr-1" />
          Confirm
        </button>
      </div>
      
      {selectedDate && selectedTime && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md animate-bounce-in">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Appointment Summary:</span><br />
            Date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}<br />
            Time: {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;