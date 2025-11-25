
import React, { useState, useRef, useEffect } from "react";
import useCentralLogger from "@/useCentralLogger";
import "@styles/CentralLog.css";

export default function CentralLogViewer() {
  const { logs, clearLogs } = useCentralLogger(20);
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);

  // 🔥 Atajo de teclado: CTRL + `
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "`") {
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Scroll automático al final
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [logs, open]);

  // ❗ Si está cerrado → no renderizamos nada visible
  if (!open) return null;

  return (
    <div className="central-log-container">

      <div className="central-log-panel">
        <div className="central-log-header">
          <span>Logs ({logs.length})</span>
          <button className="central-log-clear-btn" onClick={clearLogs}>
            ❌
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

    </div>
  );
}
