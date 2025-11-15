import { useEffect, useState } from "react";

export default function useCentralLogger(limit = 20) {
  let centralLogCounter = 0;

  const genId = () => {
    const randomPart = Math.floor(Math.random() * 10000);
    centralLogCounter++;
    return `${Date.now()}-${centralLogCounter}-${randomPart}`;
  };


  const [logs, setLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("central_logs") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const original = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };


    const addLog = (type, args) => {
      const entry = {
        id: genId(),
        type,
        message: args
          .map(a => (typeof a === "object" ? JSON.stringify(a) : a))
          .join(" "),
        time: new Date().toLocaleTimeString(),
      };

      setLogs(prev => {
        const updated = [...prev.slice(-limit + 1), entry];
        localStorage.setItem("central_logs", JSON.stringify(updated));
        return updated;
      });
    };

    console.log = (...args) => {
      original.log(...args);
      addLog("log", args);
    };

    console.warn = (...args) => {
      original.warn(...args);
      addLog("warn", args);
    };

    console.error = (...args) => {
      original.error(...args);
      addLog("error", args);
    };

    return () => {
      console.log = original.log;
      console.warn = original.warn;
      console.error = original.error;
    };
  }, [limit]);

  const clearLogs = () => {
    localStorage.removeItem("central_logs");
    setLogs([]);
  };

  return { logs, clearLogs };
}
