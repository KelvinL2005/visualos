"use client";

import React, { useState } from "react";

type StatusMsg = { text: string; type: "success" | "error" | "info" };

export default function StackPage() {
  const [stack, setStack] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [pushElement, setPushElement] = useState("");
  const [status, setStatus] = useState<StatusMsg | null>(null);

  const showStatus = (text: string, type: StatusMsg["type"]) => {
    setStatus({ text, type });
    setTimeout(() => setStatus(null), 2500);
  };

  const peek = () => {
    if (stack.length === 0) {
      showStatus("Stack is empty — nothing to peek.", "error");
      return;
    }
    showStatus(`Top element is ${stack[stack.length - 1]}.`, "info");
  };

  const pushToStack = (element: string) => {
    const num = Number(element);
    if (!isNaN(num) && element.trim() !== "") {
      setStack([...stack, num]);
      setPushElement("");
      showStatus(`Pushed ${num} onto the stack.`, "success");
    }
  };

  const popStack = () => {
    if (stack.length === 0) {
      showStatus("Stack is empty — nothing to pop.", "error");
      return;
    }
    const top = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    showStatus(`Popped ${top} from the stack.`, "success");
  };

  const isDisabled = pushElement.trim() === "" || isNaN(Number(pushElement));

  return (
    <div style={styles.page}>
      {/*  Stack Visualizer */}
      <div style={styles.visualizer}>
        <div style={styles.vizHeader}>
          <span style={styles.vizTitle}>Stack</span>
          <span style={styles.sizeTag}>{stack.length} items</span>
        </div>

        <div style={styles.stackTrack}>
          {stack.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>⬜</span>
              <span style={styles.emptyText}>Stack is empty</span>
            </div>
          ) : (
            stack.slice().reverse().map((item, index) => {
              const isTop = index === 0;
              const depth = index / Math.max(stack.length - 1, 1); // 0 = top, 1 = bottom
              const bg = interpolateColor("#E68A19", "#c0392b", depth);
              return (
                <div key={`${item}-${index}`} style={styles.itemWrapper}>
                  {isTop && <div style={styles.topLabel}>▲ top</div>}
                  <div
                    style={{
                      ...styles.stackItem,
                      backgroundColor: bg,
                      opacity: 1 - depth * 0.35, // deeper items are more faded
                      borderTopLeftRadius: isTop ? 8 : 0, // only top item has rounded corners
                      borderTopRightRadius: isTop ? 8 : 0, 
                      borderBottomLeftRadius: index === stack.length - 1 ? 8 : 0,
                      borderBottomRightRadius: index === stack.length - 1 ? 8 : 0,
                    }}
                  >
                    <span style={styles.itemValue}>{item}</span>
                    {isTop && <span style={styles.topBadge}>top</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/*  Controls Panel */}
      <div style={styles.panel}>
        <div style={styles.panelHeader}>
          <span style={styles.panelTitle}>Controls</span>
        </div>

        {/* Status message */}
        <div style={{
          ...styles.statusBox,
          opacity: status ? 1 : 0,
          background: status?.type === "error"
            ? "rgba(226, 75, 74, 0.12)"
            : status?.type === "success"
            ? "rgba(29, 158, 117, 0.12)"
            : "rgba(55, 138, 221, 0.12)",
          borderColor: status?.type === "error"
            ? "rgba(226, 75, 74, 0.35)"
            : status?.type === "success"
            ? "rgba(29, 158, 117, 0.35)"
            : "rgba(55, 138, 221, 0.35)",
          color: status?.type === "error" ? "#E24B4A"
            : status?.type === "success" ? "#1D9E75"
            : "#378ADD",
        }}>
          {status?.text ?? " "}
        </div>

        {/* Push */}
        <div style={styles.section}>
          <label style={styles.label}>Push a value</label>
          <div style={styles.row}>
            <input
              style={styles.input}
              type="number"
              placeholder="Enter number"
              value={pushElement}
              onChange={e => setPushElement(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !isDisabled && pushToStack(pushElement)}
            />
            <button
              style={{ ...styles.btn, ...styles.btnPrimary, opacity: isDisabled ? 0.45 : 1, cursor: isDisabled ? "not-allowed" : "pointer" }}
              disabled={isDisabled}
              onClick={() => pushToStack(pushElement)}
            >
              Push
            </button>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Pop + Peek */}
        <div style={styles.section}>
          <label style={styles.label}>Stack operations</label>
          <div style={styles.col}>
            <button
              style={{ ...styles.btn, ...styles.btnSecondary, opacity: stack.length === 0 ? 0.45 : 1, cursor: stack.length === 0 ? "not-allowed" : "pointer" }}
              disabled={stack.length === 0}
              onClick={popStack}
            >
              Pop — remove top
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnGhost, opacity: stack.length === 0 ? 0.45 : 1, cursor: stack.length === 0 ? "not-allowed" : "pointer" }}
              disabled={stack.length === 0}
              onClick={peek}
            >
              Peek — inspect top
            </button>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Size</span>
            <span style={styles.statValue}>{stack.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Top</span>
            <span style={styles.statValue}>{stack.length > 0 ? stack[stack.length - 1] : "—"}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Bottom</span>
            <span style={styles.statValue}>{stack.length > 0 ? stack[0] : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Linearly interpolate between two hex colors */
function interpolateColor(hexA: string, hexB: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(hexA);
  const [br, bg, bb] = parse(hexB);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${b})`;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#1a1d23",
    padding: "48px 24px",
    gap: 32,
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  // Visualizer Style 
  visualizer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 180,
  },
  vizHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    width: "100%",
  },
  vizTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#9a9ea8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  sizeTag: {
    fontSize: 12,
    color: "#5a5f6e",
    background: "#24282f",
    border: "0.5px solid #33373f",
    borderRadius: 20,
    padding: "2px 10px",
  },
  stackTrack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 160,
    minHeight: 200,
    justifyContent: "flex-start",
  },
  emptyState: {
    marginTop: 60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    color: "#3d4149",
  },
  emptyIcon: { fontSize: 32 },
  emptyText: { fontSize: 13, color: "#4a4f5a" },
  itemWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  topLabel: {
    fontSize: 11,
    color: "#E68A19",
    fontWeight: 500,
    letterSpacing: "0.06em",
    marginBottom: 4,
    textTransform: "uppercase" as const,
  },
  stackItem: {
    width: "100%",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(0,0,0,0.18)",
    transition: "opacity 0.2s",
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 500,
    color: "#fff",
  },
  topBadge: {
    fontSize: 10,
    fontWeight: 500,
    background: "rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.7)",
    borderRadius: 4,
    padding: "2px 6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
// Panel styles
  panel: {
    width: 280,
    background: "#20232b",
    border: "0.5px solid #2e323c",
    borderRadius: 14,
    padding: "20px 20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  panelHeader: {
    marginBottom: 14,
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#9a9ea8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  statusBox: {
    fontSize: 13,
    padding: "9px 12px",
    borderRadius: 8,
    border: "0.5px solid transparent",
    marginBottom: 16,
    transition: "opacity 0.3s",
    minHeight: 36,
    display: "flex",
    alignItems: "center",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "12px 0",
  },
  label: {
    fontSize: 12,
    color: "#5a5f6e",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
  },
  row: {
    display: "flex",
    gap: 8,
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "9px 12px",
    background: "#16181e",
    border: "0.5px solid #33373f",
    borderRadius: 8,
    color: "#ebebeb",
    fontSize: 14,
    outline: "none",
  },
  btn: {
    padding: "9px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    border: "0.5px solid transparent",
    transition: "opacity 0.15s",
    width: "100%",
    textAlign: "center" as const,
  },
  btnPrimary: {
    background: "#E68A19",
    color: "#fff",
    border: "none",
  },
  btnSecondary: {
    background: "#2a2e38",
    color: "#ebebeb",
    border: "0.5px solid #3a3f4a",
  },
  btnGhost: {
    background: "transparent",
    color: "#9a9ea8",
    border: "0.5px solid #2e323c",
  },
  divider: {
    height: "0.5px",
    background: "#2a2e38",
    margin: "4px 0",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    paddingTop: 12,
  },
  statCard: {
    background: "#16181e",
    borderRadius: 8,
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#5a5f6e",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  statValue: {
    fontSize: 18,
    fontWeight: 500,
    color: "#ebebeb",
  },
};
