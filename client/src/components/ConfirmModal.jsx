import { useEffect, useRef } from 'react';

export default function ConfirmModal({ task, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);

  return (
    <div className="form-overlay" role="dialog" aria-modal="true" aria-label="Confirm deletion" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-card">
        <div className="confirm-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h2 className="confirm-title">Delete Task?</h2>
        <p className="confirm-desc">
          Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button ref={cancelRef} id="confirm-cancel-btn" className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button id="confirm-delete-btn" className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
