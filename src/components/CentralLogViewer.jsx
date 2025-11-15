import React, { useState, useRef, useEffect } from "react";
import useCentralLogger from "@/useCentralLogger";
import "@styles/CentralLog.css";

export default function CentralLogViewer() {
  const { logs, clearLogs } = useCentralLogger(20);
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [logs, open]);

  return (
    <div className={`central-log-container ${open ? "open" : ""}`}>
      <div className="central-log-toggle" onClick={() => setOpen(!open)}>
        📝 Logs ({logs.length})
      </div>

      {open && (
        <div className="central-log-panel">
          {/* Header con botón borrar */}
          <div className="central-log-header">
            <span>Logs</span>

            <button
              className="central-log-clear-btn"
              onClick={clearLogs}
              title="Limpiar logs"
            >
              {/* SVG de borrar */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>

          <div className="central-log-list" ref={listRef}>
            {logs.map((log) => (
              <div key={log.id} className={`central-log-item ${log.type}`}>
                <span className="central-log-time">{log.time}</span>
                <span className="central-log-type">[{log.type}]</span>
                <span className="central-log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
