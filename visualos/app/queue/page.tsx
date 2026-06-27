"use client";

import React, { useState, useRef } from "react";

const DEFAULT_MAX_SIZE = 10;

type LogEntry = {
  id: number;
  op: string;
  msg: string;
  ok: boolean;
};

export default function QueuePage() {
  const [queue, setQueue] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [maxSize, setMaxSize] = useState(DEFAULT_MAX_SIZE);
  const [inputValue, setInputValue] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" | "info" }>({ text: "", type: "info" });
  const [peekActive, setPeekActive] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);

  const addLog = (op: string, msg: string, ok: boolean) => {
    setLog((prev) => [{ id: logIdRef.current++, op, msg, ok }, ...prev.slice(0, 7)]);
  };

  const setStatus = (text: string, type: "success" | "error" | "info") => {
    setStatusMsg({ text, type });
  };

  const handleEnqueue = () => {
    setPeekActive(false);
    const raw = inputValue.trim();
    if (!raw) { setStatus("Enter a value to enqueue.", "error"); return; }
    const val = parseInt(raw, 10);
    if (isNaN(val)) { setStatus("Value must be a number.", "error"); return; }
    if (queue.length >= maxSize) {
      setStatus(`Queue is full (max ${maxSize}).`, "error");
      addLog("enqueue", `rejected — queue full`, false);
      return;
    }
    setQueue((prev) => [...prev, val]);
    setInputValue("");
    setStatus(`Enqueued ${val} at the back.`, "success");
    addLog("enqueue", `${val} added to back`, true);
  };

  const handleDequeue = () => {
    setPeekActive(false);
    if (queue.length === 0) {
      setStatus("Queue is empty — nothing to dequeue.", "error");
      addLog("dequeue", "rejected — queue empty", false);
      return;
    }
    const val = queue[0];
    setQueue((prev) => prev.slice(1));
    setStatus(`Dequeued ${val} from the front.`, "success");
    addLog("dequeue", `${val} removed from front`, true);
  };

  const handlePeek = () => {
    if (queue.length === 0) {
      setStatus("Queue is empty — nothing to peek.", "error");
      addLog("peek", "rejected — queue empty", false);
      return;
    }
    setPeekActive(true);
    setStatus(`Front element is ${queue[0]}.`, "success");
    addLog("peek", `front is ${queue[0]}`, true);
    setTimeout(() => setPeekActive(false), 1800);
  };

  const handleClear = () => {
    setPeekActive(false);
    const count = queue.length;
    if (count === 0) { setStatus("Queue is already empty.", "info"); return; }
    setQueue([]);
    setStatus(`Cleared ${count} item${count !== 1 ? "s" : ""}.`, "success");
    addLog("clear", `removed ${count} item${count !== 1 ? "s" : ""}`, true);
  };

  const handleMaxSizeChange = (val: number) => {
    setMaxSize(val);
    if (queue.length > val) {
      const removed = queue.length - val;
      setQueue((prev) => prev.slice(0, val));
      addLog("resize", `trimmed ${removed} item${removed !== 1 ? "s" : ""} from back`, false);
    }
  };

  const statusColor =
    statusMsg.type === "error" ? "#E24B4A" :
    statusMsg.type === "success" ? "#1D9E75" :
    "#888780";

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#282c34",
      padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 720 }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Size", value: queue.length },
            { label: "Max size", value: maxSize },
            { label: "Front", value: queue.length > 0 ? queue[0] : "—" },
            { label: "Back", value: queue.length > 0 ? queue[queue.length - 1] : "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#1e2228", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 12, color: "#888780", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#ebebeb" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Queue Track */}
        <div style={{
          minHeight: 90,
          background: "#1e2228",
          borderRadius: 12,
          border: "0.5px solid #3a3f47",
          padding: 16,
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          overflowX: "auto",
          marginBottom: 24,
        }}>
          {queue.length === 0 ? (
            <span style={{ color: "#5a5f66", fontSize: 14 }}>Queue is empty</span>
          ) : (
            queue.map((item, index) => {
              const isFront = index === 0;
              const isBack = index === queue.length - 1;
              const isFull = queue.length >= maxSize && isBack;
              let bg = "#2e333b";
              let border = "0.5px solid #4a5060";
              let color = "#ebebeb";
              if (isFront && peekActive) { bg = "#0e3a2c"; border = "0.5px solid #1D9E75"; color = "#1D9E75"; }
              else if (isFull) { bg = "#3a1a1a"; border = "0.5px solid #E24B4A"; color = "#E24B4A"; }
              return (
                <div key={`${item}-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    minWidth: 44, height: 44, padding: "0 12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 8, fontSize: 15, fontWeight: 500,
                    background: bg, border, color,
                    transition: "background 0.2s, border 0.2s, color 0.2s",
                  }}>
                    {item}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, height: 16, color: isFront ? "#1D9E75" : "#5a5f66" }}>
                    {isFront ? "front" : isBack ? "back" : ""}
                  </div>
                </div>
              );
            })
          )}
          <div style={{ marginLeft: "auto", fontSize: 12, color: "#5a5f66", flexShrink: 0, paddingBottom: 18, display: "flex", alignItems: "center", gap: 4 }}>
            → front
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                placeholder="Value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
                style={{
                  flex: 1, padding: "0 12px", height: 36, background: "#1e2228",
                  border: "0.5px solid #4a5060", borderRadius: 8, color: "#ebebeb",
                  fontSize: 14, outline: "none",
                }}
              />
              <button onClick={handleEnqueue} style={btnStyle}>+ Enqueue</button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleDequeue} style={{ ...btnStyle, flex: 1 }}>Dequeue</button>
              <button onClick={handlePeek} style={{ ...btnStyle, flex: 1 }}>Peek</button>
              <button onClick={handleClear} style={{ ...btnStyle, flex: 1, color: "#E24B4A", borderColor: "#E24B4A" }}>Clear</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13, color: "#888780", display: "flex", alignItems: "center", gap: 8 }}>
              Max size
              <input
                type="range" min={1} max={20} step={1} value={maxSize}
                onChange={(e) => handleMaxSizeChange(parseInt(e.target.value, 10))}
                style={{ flex: 1, accentColor: "#FF6347" }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#ebebeb", minWidth: 20 }}>{maxSize}</span>
            </label>
            <p style={{ fontSize: 13, margin: 0, color: statusColor, minHeight: 20 }}>{statusMsg.text}</p>
          </div>
        </div>

        {/* Log */}
        <div style={{ background: "#1e2228", borderRadius: 12, border: "0.5px solid #3a3f47", padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#5a5f66", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Log</div>
          {log.length === 0 ? (
            <div style={{ fontSize: 13, color: "#5a5f66" }}>No operations yet.</div>
          ) : log.map((entry) => (
            <div key={entry.id} style={{ fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #2a2f37", display: "flex", gap: 8, color: "#888780" }}>
              <span style={{ fontWeight: 500, minWidth: 72, color: entry.ok ? "#1D9E75" : "#E24B4A" }}>{entry.op}</span>
              <span>{entry.msg}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "0 14px",
  height: 36,
  background: "transparent",
  border: "0.5px solid #4a5060",
  borderRadius: 8,
  color: "#ebebeb",
  fontSize: 13,
  cursor: "pointer",
  whiteSpace: "nowrap",
};
