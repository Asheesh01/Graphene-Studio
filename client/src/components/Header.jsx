export default function Header({ theme, onThemeToggle, activeCount, completedCount }) {
  return (
    <header className="header">
      <div className="header-inner container">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#grad)" />
              <path d="M8 14l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#7c6af7" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="header-title">TaskFlow</h1>
            <p className="header-subtitle">Personal Task Manager</p>
          </div>
        </div>

        <div className="header-right">
          <div className="stats">
            <div className="stat">
              <span className="stat-value active">{activeCount}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value done">{completedCount}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>

          <div className="kbd-hints">
            <kbd>N</kbd><span>new</span>
            <kbd>Esc</kbd><span>close</span>
          </div>

          <button
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label="Toggle dark/light mode"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
