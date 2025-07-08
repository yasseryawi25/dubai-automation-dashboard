import { useState, useMemo } from 'react';
import type { Lead, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Sample Dubai leads data
const sampleLeads: Lead[] = (() => {
  // Helper to create messages with correct leadId
  function makeMessages(leadId: string, messages: Omit<Message, 'id' | 'leadId'>[]): Message[] {
    return messages.map(m => ({ id: uuidv4(), leadId, ...m }));
  }
  // Predefine leads (will fill messages after)
  const leads: Omit<Lead, 'id' | 'messages'>[] = [
    {
      name: 'Ahmed Al-Rashid',
      phone: '+971 50 123 4567',
      email: 'ahmed.rashid@email.com',
      source: 'whatsapp',
      score: 95,
      status: 'qualified',
      lastActivity: '2025-07-07T09:10:00Z',
      propertyInterest: '3BR Villa in Arabian Ranches',
      budget: 3500000,
      location: 'Arabian Ranches',
      timeline: 'Next 2 months',
      assignedAgent: 'Sarah Al-Mansouri',
      createdAt: '2025-07-01T10:00:00Z',
      updatedAt: '2025-07-07T09:10:00Z',
    },
    {
      name: 'Maria Gonzalez',
      phone: '+971 55 987 6543',
      email: 'maria.gonzalez@email.com',
      source: 'bayut',
      score: 78,
      status: 'interested',
      lastActivity: '2025-07-06T15:30:00Z',
      propertyInterest: '2BR Apartment in Marina',
      budget: 1800000,
      location: 'Dubai Marina',
      timeline: 'Next 6 months',
      assignedAgent: 'Omar Hassan',
      createdAt: '2025-07-02T11:00:00Z',
      updatedAt: '2025-07-06T15:30:00Z',
    },
    // 18 more diverse leads below (see next block for details)
    {
      name: 'Fatima Al-Zahra',
      phone: '+971 52 234 5678',
      email: 'fatima.zahra@email.com',
      source: 'property_finder',
      score: 89,
      status: 'viewing_scheduled',
      lastActivity: '2025-07-07T14:20:00Z',
      propertyInterest: '4BR Penthouse in JBR',
      budget: 8500000,
      location: 'Jumeirah Beach Residence',
      timeline: 'Next month',
      assignedAgent: 'Alex Thompson',
      createdAt: '2025-07-03T09:00:00Z',
      updatedAt: '2025-07-07T14:20:00Z',
    },
    {
      name: 'John Smith',
      phone: '+971 56 345 6789',
      email: 'john.smith@email.com',
      source: 'website',
      score: 92,
      status: 'negotiating',
      lastActivity: '2025-07-07T16:45:00Z',
      propertyInterest: '3BR Apartment in Downtown',
      budget: 4200000,
      location: 'Downtown Dubai',
      timeline: 'Immediate',
      assignedAgent: 'Sarah Al-Mansouri',
      createdAt: '2025-07-01T08:00:00Z',
      updatedAt: '2025-07-07T16:45:00Z',
    },
    {
      name: 'Omar Hassan',
      phone: '+971 58 111 2233',
      email: 'omar.hassan@email.com',
      source: 'referral',
      score: 81,
      status: 'contacted',
      lastActivity: '2025-07-05T13:00:00Z',
      propertyInterest: '5BR Villa in Emirates Hills',
      budget: 15000000,
      location: 'Emirates Hills',
      timeline: '3 months',
      assignedAgent: 'Fatima Al-Zahra',
      createdAt: '2025-07-01T12:00:00Z',
      updatedAt: '2025-07-05T13:00:00Z',
    },
    {
      name: 'Lina Chen',
      phone: '+971 54 222 3344',
      email: 'lina.chen@email.com',
      source: 'website',
      score: 74,
      status: 'new',
      lastActivity: '2025-07-07T08:00:00Z',
      propertyInterest: 'Studio in Business Bay',
      budget: 800000,
      location: 'Business Bay',
      timeline: '6 months',
      assignedAgent: 'Omar Hassan',
      createdAt: '2025-07-06T10:00:00Z',
      updatedAt: '2025-07-07T08:00:00Z',
    },
    {
      name: 'Yousef Al-Mansoori',
      phone: '+971 50 555 6667',
      email: 'yousef.mansoori@email.com',
      source: 'bayut',
      score: 88,
      status: 'closed_won',
      lastActivity: '2025-07-04T17:00:00Z',
      propertyInterest: '2BR Townhouse in Dubai Hills',
      budget: 2200000,
      location: 'Dubai Hills',
      timeline: 'Immediate',
      assignedAgent: 'Alex Thompson',
      createdAt: '2025-06-28T09:00:00Z',
      updatedAt: '2025-07-04T17:00:00Z',
    },
    {
      name: 'Priya Singh',
      phone: '+971 55 333 4445',
      email: 'priya.singh@email.com',
      source: 'property_finder',
      score: 70,
      status: 'closed_lost',
      lastActivity: '2025-07-03T12:00:00Z',
      propertyInterest: '1BR Apartment in JLT',
      budget: 950000,
      location: 'Jumeirah Lake Towers',
      timeline: 'Next year',
      assignedAgent: 'Sarah Al-Mansouri',
      createdAt: '2025-06-30T14:00:00Z',
      updatedAt: '2025-07-03T12:00:00Z',
    },
    {
      name: 'Mohammed Bin Saeed',
      phone: '+971 56 777 8889',
      email: 'mohammed.saeed@email.com',
      source: 'website',
      score: 83,
      status: 'qualified',
      lastActivity: '2025-07-06T11:00:00Z',
      propertyInterest: '3BR Villa in Palm Jumeirah',
      budget: 9500000,
      location: 'Palm Jumeirah',
      timeline: '2 months',
      assignedAgent: 'Omar Hassan',
      createdAt: '2025-07-02T13:00:00Z',
      updatedAt: '2025-07-06T11:00:00Z',
    },
    {
      name: 'Sara Al-Khalifa',
      phone: '+971 52 888 9990',
      email: 'sara.khalifa@email.com',
      source: 'referral',
      score: 76,
      status: 'contacted',
      lastActivity: '2025-07-05T10:00:00Z',
      propertyInterest: '2BR Apartment in Dubai Creek',
      budget: 1700000,
      location: 'Dubai Creek Harbour',
      timeline: '4 months',
      assignedAgent: 'Priya Singh',
      createdAt: '2025-07-01T15:00:00Z',
      updatedAt: '2025-07-05T10:00:00Z',
    },
    {
      name: 'David Lee',
      phone: '+971 58 444 5556',
      email: 'david.lee@email.com',
      source: 'whatsapp',
      score: 90,
      status: 'viewing_scheduled',
      lastActivity: '2025-07-07T13:00:00Z',
      propertyInterest: '2BR Apartment in Dubai Marina',
      budget: 2100000,
      location: 'Dubai Marina',
      timeline: 'Next week',
      assignedAgent: 'Fatima Al-Zahra',
      createdAt: '2025-07-03T11:00:00Z',
      updatedAt: '2025-07-07T13:00:00Z',
    },
    {
      name: 'Layla Nasser',
      phone: '+971 54 666 7778',
      email: 'layla.nasser@email.com',
      source: 'bayut',
      score: 85,
      status: 'interested',
      lastActivity: '2025-07-06T16:00:00Z',
      propertyInterest: '1BR Apartment in City Walk',
      budget: 1600000,
      location: 'City Walk',
      timeline: '2 months',
      assignedAgent: 'Alex Thompson',
      createdAt: '2025-07-02T16:00:00Z',
      updatedAt: '2025-07-06T16:00:00Z',
    },
    {
      name: 'Hassan Al-Farsi',
      phone: '+971 50 999 8887',
      email: 'hassan.farsi@email.com',
      source: 'property_finder',
      score: 79,
      status: 'new',
      lastActivity: '2025-07-07T07:00:00Z',
      propertyInterest: 'Studio in JVC',
      budget: 850000,
      location: 'Jumeirah Village Circle',
      timeline: '6 months',
      assignedAgent: 'Priya Singh',
      createdAt: '2025-07-06T09:00:00Z',
      updatedAt: '2025-07-07T07:00:00Z',
    },
    {
      name: 'Emily Clark',
      phone: '+971 56 222 3334',
      email: 'emily.clark@email.com',
      source: 'website',
      score: 82,
      status: 'negotiating',
      lastActivity: '2025-07-07T15:00:00Z',
      propertyInterest: '3BR Townhouse in Arabian Ranches',
      budget: 3200000,
      location: 'Arabian Ranches',
      timeline: 'Immediate',
      assignedAgent: 'Sarah Al-Mansouri',
      createdAt: '2025-07-01T13:00:00Z',
      updatedAt: '2025-07-07T15:00:00Z',
    },
    {
      name: 'Khalid Al-Maktoum',
      phone: '+971 52 333 4446',
      email: 'khalid.maktoum@email.com',
      source: 'referral',
      score: 87,
      status: 'qualified',
      lastActivity: '2025-07-06T12:00:00Z',
      propertyInterest: '5BR Villa in Palm Jumeirah',
      budget: 12000000,
      location: 'Palm Jumeirah',
      timeline: 'Next 3 months',
      assignedAgent: 'Omar Hassan',
      createdAt: '2025-07-02T14:00:00Z',
      updatedAt: '2025-07-06T12:00:00Z',
    },
    {
      name: 'Noura Al-Sabah',
      phone: '+971 54 555 6668',
      email: 'noura.sabah@email.com',
      source: 'bayut',
      score: 80,
      status: 'contacted',
      lastActivity: '2025-07-05T11:00:00Z',
      propertyInterest: '2BR Apartment in Dubai Marina',
      budget: 2000000,
      location: 'Dubai Marina',
      timeline: 'Next month',
      assignedAgent: 'Fatima Al-Zahra',
      createdAt: '2025-07-01T16:00:00Z',
      updatedAt: '2025-07-05T11:00:00Z',
    },
    {
      name: 'James Wilson',
      phone: '+971 58 333 4445',
      email: 'james.wilson@email.com',
      source: 'website',
      score: 75,
      status: 'closed_lost',
      lastActivity: '2025-07-03T13:00:00Z',
      propertyInterest: '2BR Apartment in Business Bay',
      budget: 1400000,
      location: 'Business Bay',
      timeline: 'Next year',
      assignedAgent: 'Priya Singh',
      createdAt: '2025-06-30T15:00:00Z',
      updatedAt: '2025-07-03T13:00:00Z',
    },
    {
      name: 'Aisha Al-Mazrouei',
      phone: '+971 50 444 5556',
      email: 'aisha.mazrouei@email.com',
      source: 'property_finder',
      score: 91,
      status: 'closed_won',
      lastActivity: '2025-07-04T18:00:00Z',
      propertyInterest: '4BR Villa in Dubai Hills',
      budget: 8000000,
      location: 'Dubai Hills',
      timeline: 'Immediate',
      assignedAgent: 'Alex Thompson',
      createdAt: '2025-06-28T10:00:00Z',
      updatedAt: '2025-07-04T18:00:00Z',
    },
    {
      name: 'Bilal Rahman',
      phone: '+971 56 888 9991',
      email: 'bilal.rahman@email.com',
      source: 'whatsapp',
      score: 73,
      status: 'new',
      lastActivity: '2025-07-07T06:00:00Z',
      propertyInterest: 'Studio in JVC',
      budget: 900000,
      location: 'Jumeirah Village Circle',
      timeline: '6 months',
      assignedAgent: 'Sarah Al-Mansouri',
      createdAt: '2025-07-06T11:00:00Z',
      updatedAt: '2025-07-07T06:00:00Z',
    },
    {
      name: 'Olga Petrova',
      phone: '+971 54 111 2223',
      email: 'olga.petrova@email.com',
      source: 'bayut',
      score: 84,
      status: 'interested',
      lastActivity: '2025-07-06T17:00:00Z',
      propertyInterest: '2BR Apartment in JBR',
      budget: 2100000,
      location: 'Jumeirah Beach Residence',
      timeline: 'Next 2 months',
      assignedAgent: 'Omar Hassan',
      createdAt: '2025-07-02T17:00:00Z',
      updatedAt: '2025-07-06T17:00:00Z',
    },
    {
      name: 'Rashid Al-Falasi',
      phone: '+971 50 777 8886',
      email: 'rashid.falasi@email.com',
      source: 'referral',
      score: 86,
      status: 'qualified',
      lastActivity: '2025-07-06T13:00:00Z',
      propertyInterest: '3BR Villa in Emirates Hills',
      budget: 13500000,
      location: 'Emirates Hills',
      timeline: '3 months',
      assignedAgent: 'Fatima Al-Zahra',
      createdAt: '2025-07-01T17:00:00Z',
      updatedAt: '2025-07-06T13:00:00Z',
    },
    {
      name: 'Chen Wei',
      phone: '+971 56 111 2224',
      email: 'chen.wei@email.com',
      source: 'website',
      score: 77,
      status: 'contacted',
      lastActivity: '2025-07-05T12:00:00Z',
      propertyInterest: '1BR Apartment in Dubai Creek',
      budget: 1200000,
      location: 'Dubai Creek Harbour',
      timeline: '4 months',
      assignedAgent: 'Priya Singh',
      createdAt: '2025-07-01T18:00:00Z',
      updatedAt: '2025-07-05T12:00:00Z',
    },
  ];
  // Now assign ids and messages
  return leads.map((lead, i) => {
    const id = uuidv4();
    // Sample messages for some leads
    let messages: Message[] = [];
    if (i === 2) { // Fatima Al-Zahra
      messages = makeMessages(id, [
        { type: 'whatsapp', sender: 'lead', content: 'Hi, I saw your penthouse listing in JBR. Very interested!', timestamp: '2025-07-06T10:30:00Z' },
        { type: 'whatsapp', sender: 'ai', agentName: 'Alex Thompson', content: 'Hello Fatima! Thank you for your interest. I can schedule a viewing for this weekend. What time works best?', timestamp: '2025-07-06T10:45:00Z' },
        { type: 'whatsapp', sender: 'lead', content: 'Saturday 2 PM would be perfect. Can you send me more details about amenities?', timestamp: '2025-07-06T11:00:00Z' },
      ]);
    } else if (i === 3) { // John Smith
      messages = makeMessages(id, [
        { type: 'email', sender: 'lead', content: 'I would like to make an offer of AED 4M for the downtown apartment.', timestamp: '2025-07-07T15:30:00Z' },
        { type: 'email', sender: 'agent', agentName: 'Sarah Al-Mansouri', content: 'Thank you John. I will present your offer to the seller and get back to you within 24 hours.', timestamp: '2025-07-07T16:00:00Z' },
      ]);
    } else if (i === 0) { // Ahmed Al-Rashid
      messages = makeMessages(id, [
        { type: 'whatsapp', sender: 'lead', content: 'Is the villa in Arabian Ranches still available?', timestamp: '2025-07-01T10:05:00Z' },
        { type: 'whatsapp', sender: 'agent', agentName: 'Sarah Al-Mansouri', content: 'Yes, Ahmed. Would you like to schedule a viewing?', timestamp: '2025-07-01T10:10:00Z' },
        { type: 'whatsapp', sender: 'lead', content: 'Yes, please. Next week works for me.', timestamp: '2025-07-01T10:15:00Z' },
      ]);
    } else if (i === 1) { // Maria Gonzalez
      messages = makeMessages(id, [
        { type: 'whatsapp', sender: 'lead', content: 'Hi, I am interested in the 2BR in Marina.', timestamp: '2025-07-02T11:10:00Z' },
        { type: 'whatsapp', sender: 'ai', agentName: 'Omar Hassan', content: 'Hello Maria! Thank you for your interest. When would you like to view the property?', timestamp: '2025-07-02T11:15:00Z' },
      ]);
    } else if (i === 4) { // Omar Hassan
      messages = makeMessages(id, [
        { type: 'call', sender: 'agent', agentName: 'Fatima Al-Zahra', content: 'Called Omar, discussed requirements for Emirates Hills villa.', timestamp: '2025-07-01T12:30:00Z' },
      ]);
    } else if (i === 5) { // Lina Chen
      messages = makeMessages(id, [
        { type: 'email', sender: 'lead', content: 'Interested in studio in Business Bay. Can I get more info?', timestamp: '2025-07-06T10:10:00Z' },
        { type: 'email', sender: 'ai', agentName: 'Omar Hassan', content: 'Hi Lina, I have sent you the brochure and details. Let me know if you have questions.', timestamp: '2025-07-06T10:20:00Z' },
      ]);
    }
    // Add more sample messages for other leads as needed
    return { ...lead, id, messages };
  });
})();

export function useLeadsData() {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'status'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Filtering and sorting
  const filteredLeads = useMemo(() => {
    let result = leads;
    if (search) {
      result = result.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search) ||
        l.location.toLowerCase().includes(search.toLowerCase()) ||
        l.propertyInterest.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter);
    }
    if (sortBy === 'score') {
      result = result.sort((a, b) => sortDir === 'asc' ? a.score - b.score : b.score - a.score);
    } else if (sortBy === 'date') {
      result = result.sort((a, b) => sortDir === 'asc'
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (sortBy === 'status') {
      result = result.sort((a, b) => sortDir === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
    }
    return result;
  }, [leads, search, statusFilter, sortBy, sortDir]);

  // Add, update, delete, assign, etc. can be implemented here

  return {
    leads: filteredLeads,
    setLeads,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  };
} 