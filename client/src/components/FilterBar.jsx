const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
];

const STATUSES = [
  { value: 'all', label: 'All Tasks' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function FilterBar({ filter, onFilterChange, search, onSearchChange, priorityFilter, onPriorityFilterChange, onNewTask }) {
  return (
    <div className="filterbar">
      <div className="filterbar-left">
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="task-search"
            type="text"
            className="search-input"
            placeholder="Search tasks…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search tasks by title or description"
          />
          {search && (
            <button className="search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">×</button>
          )}
        </div>

        <div className="filter-group" role="group" aria-label="Filter by status">
          {STATUSES.map(s => (
            <button
              key={s.value}
              id={`filter-${s.value}`}
              className={`filter-btn ${filter === s.value ? 'active' : ''}`}
              onClick={() => onFilterChange(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <select
          id="priority-filter"
          className="priority-select"
          value={priorityFilter}
          onChange={e => onPriorityFilterChange(e.target.value)}
          aria-label="Filter by priority"
        >
          {PRIORITIES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <button id="new-task-btn" className="btn-primary" onClick={onNewTask} aria-label="Add new task (N)">
        <span className="btn-icon">+</span> New Task
      </button>
    </div>
  );
}
