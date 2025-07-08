import React, { useState } from 'react';
import type { CalendarEvent } from '../types';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const eventColors = {
  viewing: 'bg-blue-500 border-blue-600',
  meeting: 'bg-green-500 border-green-600',
  call: 'bg-yellow-500 border-yellow-600',
  task: 'bg-purple-500 border-purple-600',
  rera_appointment: 'bg-red-500 border-red-600',
};

const eventStatusColors = {
  scheduled: 'opacity-70',
  confirmed: 'opacity-100',
  completed: 'opacity-50 line-through',
  cancelled: 'opacity-30 line-through',
  rescheduled: 'opacity-80',
};

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Marina Apartment Viewing',
    type: 'viewing',
    startTime: '2024-07-08T10:00:00+04:00',
    endTime: '2024-07-08T11:00:00+04:00',
    location: 'Dubai Marina, Marina Walk',
    clientName: 'Ahmed Al-Rashid',
    clientPhone: '+971 50 123 4567',
    propertyAddress: 'Marina Walk, Dubai Marina',
    propertyType: 'apartment',
    agentAssigned: 'Layla (Follow-up Specialist)',
    status: 'confirmed',
    notes: '2BR apartment, sea view, interested in investment',
    reminderSent: true,
    createdAt: '2024-07-07T09:00:00+04:00',
    updatedAt: '2024-07-07T09:00:00+04:00',
  },
  {
    id: '2',
    title: 'RERA Compliance Meeting',
    type: 'rera_appointment',
    startTime: '2024-07-08T14:00:00+04:00',
    endTime: '2024-07-08T15:30:00+04:00',
    location: 'RERA Office, DIFC',
    agentAssigned: 'Sarah (Manager Agent)',
    status: 'scheduled',
    notes: 'Property registration and compliance documentation',
    reminderSent: false,
    createdAt: '2024-07-06T16:00:00+04:00',
    updatedAt: '2024-07-06T16:00:00+04:00',
  },
  {
    id: '3',
    title: 'Palm Villa Viewing',
    type: 'viewing',
    startTime: '2024-07-10T16:00:00+04:00',
    endTime: '2024-07-10T17:00:00+04:00',
    location: 'Palm Jumeirah',
    clientName: 'Fatima Al-Zahra',
    clientPhone: '+971 52 234 5678',
    propertyAddress: 'Palm Jumeirah, Villa 12',
    propertyType: 'villa',
    agentAssigned: 'Omar (Lead Qualification)',
    status: 'scheduled',
    notes: 'High-value client, prefers privacy',
    reminderSent: false,
    createdAt: '2024-07-08T10:00:00+04:00',
    updatedAt: '2024-07-08T10:00:00+04:00',
  },
  {
    id: '4',
    title: 'Weekly Team Meeting',
    type: 'meeting',
    startTime: '2024-07-09T09:00:00+04:00',
    endTime: '2024-07-09T10:00:00+04:00',
    location: 'Office, Downtown Dubai',
    agentAssigned: 'Sarah (Manager Agent)',
    status: 'confirmed',
    notes: 'Discuss pipeline and new leads',
    reminderSent: true,
    createdAt: '2024-07-07T12:00:00+04:00',
    updatedAt: '2024-07-07T12:00:00+04:00',
  },
  {
    id: '5',
    title: 'Client Follow-up Call',
    type: 'call',
    startTime: '2024-07-11T11:30:00+04:00',
    endTime: '2024-07-11T12:00:00+04:00',
    location: 'Remote',
    clientName: 'John Smith',
    clientPhone: '+971 56 345 6789',
    agentAssigned: 'Layla (Follow-up Specialist)',
    status: 'scheduled',
    notes: 'Discuss offer for Downtown apartment',
    reminderSent: false,
    createdAt: '2024-07-09T09:00:00+04:00',
    updatedAt: '2024-07-09T09:00:00+04:00',
  },
  {
    id: '6',
    title: 'Document Generation',
    type: 'task',
    startTime: '2024-07-12T13:00:00+04:00',
    endTime: '2024-07-12T14:00:00+04:00',
    location: 'Office',
    agentAssigned: 'Maya (Campaign Coordinator)',
    status: 'pending',
    notes: 'Prepare contract for new client',
    reminderSent: false,
    createdAt: '2024-07-10T10:00:00+04:00',
    updatedAt: '2024-07-10T10:00:00+04:00',
  },
  {
    id: '7',
    title: 'Business Bay Viewing',
    type: 'viewing',
    startTime: '2024-07-13T15:00:00+04:00',
    endTime: '2024-07-13T16:00:00+04:00',
    location: 'Business Bay',
    clientName: 'Priya Singh',
    clientPhone: '+971 55 333 4445',
    propertyAddress: 'Bay Square, Business Bay',
    propertyType: 'apartment',
    agentAssigned: 'Ahmed (Appointment Agent)',
    status: 'confirmed',
    notes: 'Client wants to see multiple units',
    reminderSent: true,
    createdAt: '2024-07-11T11:00:00+04:00',
    updatedAt: '2024-07-11T11:00:00+04:00',
  },
  {
    id: '8',
    title: 'Market Update Call',
    type: 'call',
    startTime: '2024-07-14T10:00:00+04:00',
    endTime: '2024-07-14T10:30:00+04:00',
    location: 'Remote',
    clientName: 'Olga Petrova',
    clientPhone: '+971 54 111 2223',
    agentAssigned: 'Omar (Lead Qualification)',
    status: 'scheduled',
    notes: 'Discuss Dubai market trends',
    reminderSent: false,
    createdAt: '2024-07-12T09:00:00+04:00',
    updatedAt: '2024-07-12T09:00:00+04:00',
  },
  {
    id: '9',
    title: 'JVC Townhouse Viewing',
    type: 'viewing',
    startTime: '2024-07-15T17:00:00+04:00',
    endTime: '2024-07-15T18:00:00+04:00',
    location: 'Jumeirah Village Circle (JVC)',
    clientName: 'Bilal Rahman',
    clientPhone: '+971 56 888 9991',
    propertyAddress: 'JVC, Townhouse 7',
    propertyType: 'townhouse',
    agentAssigned: 'Alex (Pipeline Coordinator)',
    status: 'confirmed',
    notes: 'Client relocating from Abu Dhabi',
    reminderSent: true,
    createdAt: '2024-07-13T10:00:00+04:00',
    updatedAt: '2024-07-13T10:00:00+04:00',
  },
  {
    id: '10',
    title: 'Contract Signing',
    type: 'task',
    startTime: '2024-07-16T12:00:00+04:00',
    endTime: '2024-07-16T13:00:00+04:00',
    location: 'Office, Dubai Hills Estate',
    agentAssigned: 'Sarah (Manager Agent)',
    status: 'scheduled',
    notes: 'Sign contract for Dubai Hills villa',
    reminderSent: false,
    createdAt: '2024-07-14T09:00:00+04:00',
    updatedAt: '2024-07-14T09:00:00+04:00',
  },
];

const formatDubaiTime = (dateString: string) => {
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateString));
};

const formatDubaiDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: { date: string; dayNumber: number; events: CalendarEvent[] }[] = [];
  // Pad start
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: '', dayNumber: 0, events: [] });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayDate = new Date(year, month, d);
    const iso = dayDate.toISOString();
    const events = sampleEvents.filter(ev => {
      const evDate = new Date(ev.startTime);
      return (
        evDate.getFullYear() === year &&
        evDate.getMonth() === month &&
        evDate.getDate() === d
      );
    });
    days.push({ date: iso, dayNumber: d, events });
  }
  return days;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const calendarDays = getMonthDays(currentDate);

  const openEventModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const goToToday = () => setCurrentDate(new Date());
  const goToPrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
    }
  };
  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded font-medium ${viewMode === 'month' ? 'bg-primary-gold text-white' : 'bg-neutral-100 text-neutral-700'}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 rounded font-medium ${viewMode === 'week' ? 'bg-primary-gold text-white' : 'bg-neutral-100 text-neutral-700'}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded font-medium ${viewMode === 'day' ? 'bg-primary-gold text-white' : 'bg-neutral-100 text-neutral-700'}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
        </div>
        <div className="flex space-x-2 items-center">
          <button onClick={goToPrev} className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200"><ChevronLeft /></button>
          <button onClick={goToToday} className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200 font-medium">Today</button>
          <button onClick={goToNext} className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200"><ChevronRight /></button>
          <button className="flex items-center px-3 py-1 rounded bg-primary-gold text-white font-medium ml-2"><Plus className="w-4 h-4 mr-1" /> Add Event</button>
        </div>
      </div>
      {/* Dubai Timezone Display */}
      <div className="mb-2 text-xs text-neutral-500">Timezone: Asia/Dubai (GMT+4)</div>
      {/* Calendar Grid (Month View) */}
      {viewMode === 'month' && (
        <div className="calendar-grid grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-semibold text-center py-2 bg-neutral-50 rounded">
              {day}
            </div>
          ))}
          {/* Calendar days with events */}
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`calendar-day min-h-[120px] border p-1 rounded ${day.dayNumber === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? 'border-primary-gold' : 'border-neutral-200'}`}
            >
              <div className="font-medium text-xs mb-1 text-right">{day.dayNumber > 0 ? day.dayNumber : ''}</div>
              <div className="flex flex-col gap-1">
                {day.events.map(event => (
                  <div
                    key={event.id}
                    className={`event-item text-xs p-1 mb-1 rounded cursor-pointer truncate ${eventColors[event.type]} ${eventStatusColors[event.status]}`}
                    title={event.title}
                    onClick={() => openEventModal(event)}
                  >
                    {formatDubaiTime(event.startTime)} {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* TODO: Week and Day views can be implemented similarly */}
      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{selectedEvent.title}</h3>
            <div className="space-y-2">
              <p><strong>Type:</strong> {selectedEvent.type}</p>
              <p><strong>Time:</strong> {formatDubaiDate(selectedEvent.startTime)} {formatDubaiTime(selectedEvent.startTime)} - {formatDubaiTime(selectedEvent.endTime)}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              {selectedEvent.clientName && (
                <p><strong>Client:</strong> {selectedEvent.clientName} {selectedEvent.clientPhone && (<span className="text-xs text-neutral-400 ml-2">{selectedEvent.clientPhone}</span>)}</p>
              )}
              {selectedEvent.propertyAddress && (
                <p><strong>Property:</strong> {selectedEvent.propertyAddress} {selectedEvent.propertyType && (<span className="text-xs text-neutral-400 ml-2">{selectedEvent.propertyType}</span>)}</p>
              )}
              <p><strong>Agent:</strong> {selectedEvent.agentAssigned}</p>
              <p><strong>Status:</strong> {selectedEvent.status}</p>
              {selectedEvent.notes && <p><strong>Notes:</strong> {selectedEvent.notes}</p>}
            </div>
            <div className="flex space-x-2 mt-6">
              <button className="bg-primary-gold px-4 py-2 rounded text-white">Edit</button>
              <button className="bg-gray-500 px-4 py-2 rounded text-white">Cancel</button>
              <button onClick={closeEventModal} className="px-4 py-2 rounded border">Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .calendar-grid { font-size: 0.75rem; }
          .calendar-day { min-height: 80px; }
          .event-item { font-size: 0.625rem; padding: 0.25rem; }
        }
      `}</style>
    </div>
  );
};

export default CalendarView; 