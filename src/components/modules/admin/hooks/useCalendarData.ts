import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '../types';

export const useCalendarData = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data - replace with actual API calls
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
      updatedAt: '2024-07-07T09:00:00+04:00'
    }
    // Add more events...
  ];

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(sampleEvents);
    } catch (err) {
      setError('Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEvent: CalendarEvent = {
        ...event,
        id: `event-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Failed to create event');
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      setEvents(prev => prev.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      ));
    } catch (err) {
      setError('Failed to update event');
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      setError('Failed to delete event');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
}; 