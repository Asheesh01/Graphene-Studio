export default function EmptyState({ filter, search }) {
  const hasFilters = filter !== 'all' || search;

  return (
    <div className="empty-state" role="status" aria-label="No tasks">
      <div className="empty-icon">
        {hasFilters ? (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
            <path d="M20 20l16 16M36 20L20 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect x="10" y="14" width="36" height="32" rx="6" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 22h36" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 10v8M36 10v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 32h6M20 38h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <h3 className="empty-title">
        {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="empty-desc">
        {hasFilters
          ? 'Try clearing the search or changing the filter.'
          : 'Press N or click "New Task" to add your first task.'}
      </p>
    </div>
  );
}
