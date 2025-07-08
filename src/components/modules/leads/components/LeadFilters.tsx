import React from 'react';

interface LeadFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  sortBy: 'score' | 'date' | 'status';
  setSortBy: (v: 'score' | 'date' | 'status') => void;
  sortDir: 'asc' | 'desc';
  setSortDir: (v: 'asc' | 'desc') => void;
}

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'interested', label: 'Interested' },
  { value: 'viewing_scheduled', label: 'Viewing Scheduled' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

const LeadFilters: React.FC<LeadFiltersProps> = React.memo(({
  search, setSearch, statusFilter, setStatusFilter, sortBy, setSortBy, sortDir, setSortDir
}) => (
  <div className="flex flex-wrap items-center gap-2 mb-4">
    <input
      type="text"
      className="border rounded px-3 py-1 text-sm w-48"
      placeholder="Search by name, phone, location..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      aria-label="Search leads"
    />
    <select
      className="border rounded px-2 py-1 text-sm"
      value={statusFilter}
      onChange={e => setStatusFilter(e.target.value)}
      aria-label="Filter by status"
    >
      {statusOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <select
      className="border rounded px-2 py-1 text-sm"
      value={sortBy}
      onChange={e => setSortBy(e.target.value as any)}
      aria-label="Sort by"
    >
      <option value="score">Score</option>
      <option value="date">Last Updated</option>
      <option value="status">Status</option>
    </select>
    <button
      className="border rounded px-2 py-1 text-sm bg-neutral-100 hover:bg-neutral-200"
      onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
      aria-label="Toggle sort direction"
    >
      {sortDir === 'asc' ? '↑' : '↓'}
    </button>
  </div>
));

export default LeadFilters; 