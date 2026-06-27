"use client";
import React, { useState } from "react";

type StatusMsg = { text: string; type: "success" | "error" | "info" };

export default function ArrayPage() {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [frames, setFrames] = useState<number[][]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [indexValue, setIndexValue] = useState("");
  const [elementValue, setElement] = useState("");
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [status, setStatus] = useState<StatusMsg | null>(null);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const lockUI = isSorting;

  const showStatus = (text: string, type: StatusMsg["type"]) => {
    setStatus({ text, type });
    setTimeout(() => setStatus(null), 2800);
  };

   

  const generateRandomArray = () => {
    setIsSorted(false);
    if (lockUI) return;
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10) + 1);
    setArray(newArray);
    showStatus("Generated a new random array.", "info");
  };

  const deleteAtIndex = (index: number) => {
    setIsSorted(false);
    if (lockUI) return;
    if (index < 0 || index >= array.length) { showStatus(`Index ${index} is out of range.`, "error"); return; }
    setArray((prev) => prev.filter((_, i) => i !== index));
    setInputValue2("");
    showStatus(`Deleted element at index ${index}.`, "success");
  };

  const insertAtIndex = (index: number, element: number) => {
    setIsSorted(false);
    if (lockUI) return;
    if (index < 0 || index > array.length) { showStatus(`Index ${index} is out of range.`, "error"); return; }
    const newArray = [...array];
    newArray.splice(index, 0, element);
    setArray(newArray);
    setIndexValue("");
    setElement("");
    showStatus(`Inserted ${element} at index ${index}.`, "success");
  };

  const updateAtIndex = (index: number, value: number) => {
    setIsSorted(false);
    if (lockUI) return;
    if (index < 0 || index >= array.length) { showStatus(`Index ${index} is out of range.`, "error"); return; }
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
    showStatus(`Updated index ${index} to ${value}.`, "success");
  };

  const playSortedSound = () => {
    const audio = new Audio("/sorted.mp3");
    audio.play().catch(() => {});
  };

  const bubblesort = async () => {
    if (lockUI) return;
    setIsSorting(true);
    setIsSorted(false);
    const arr = [...array];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await delay(300);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await delay(300);
        }
      }
    }
    setActiveIndices([]);
    setIsSorting(false);
    setIsSorted(true);
    playSortedSound();
    showStatus("Bubble sort complete.", "success");
  };

  const mergeSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    setIsSorted(false);
    setFrames([]);
    const arr = [...array];

    const sort = async (input: number[]): Promise<number[]> => {
      if (input.length <= 1) return input;
      const mid = Math.floor(input.length / 2);
      const left = await sort(input.slice(0, mid));
      const right = await sort(input.slice(mid));
      setFrames(prev => [...prev, left, right]);
      await delay(400);
      return await merge(left, right);
    };

    const merge = async (left: number[], right: number[]) => {
      const result: number[] = [];
      let l = 0, r = 0;
      while (l < left.length && r < right.length) {
        if (left[l] < right[r]) result.push(left[l++]);
        else result.push(right[r++]);
        setFrames(prev => [...prev, [...result, ...left.slice(l), ...right.slice(r)]]);
        await delay(400);
      }
      while (l < left.length) { result.push(left[l++]); setFrames(prev => [...prev, [...result, ...left.slice(l)]]); await delay(400); }
      while (r < right.length) { result.push(right[r++]); setFrames(prev => [...prev, [...result, ...right.slice(r)]]); await delay(400); }
      return result;
    };

    const sorted = await sort(arr);
    setArray(sorted);
    setFrames([]);
    setActiveIndices([]);
    setIsSorting(false);
    setIsSorted(true);
    playSortedSound();
    showStatus("Merge sort complete.", "success");
  };


  const maxVal = Math.max(...array, 1);
  const statusColor = status?.type === "error" ? "#E24B4A" : status?.type === "success" ? "#1D9E75" : "#378ADD";
  const statusBg = status?.type === "error" ? "rgba(226,75,74,0.12)" : status?.type === "success" ? "rgba(29,158,117,0.12)" : "rgba(55,138,221,0.12)";
  const statusBorder = status?.type === "error" ? "rgba(226,75,74,0.35)" : status?.type === "success" ? "rgba(29,158,117,0.35)" : "rgba(55,138,221,0.35)";

  return (
    <div style={s.page}>

      {/*  Left panel: controls  */}
      <div style={s.panel}>
        <div style={s.panelTitle}>Controls</div>

        {/* Status */}
        <div style={{
          ...s.statusBox,
          opacity: status ? 1 : 0,
          background: statusBg,
          borderColor: statusBorder,
          color: statusColor,
        }}>
          {status?.text ?? " "}
        </div>

        {/* Append */}
        <div style={s.section}>
          <div style={s.sectionLabel}>Append</div>
          <div style={s.row}>
            <input style={s.input} disabled={lockUI} value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" type="number"
              onKeyDown={e => { if (e.key === "Enter" && inputValue.trim() && !isNaN(Number(inputValue))) { setArray([...array, Number(inputValue)]); setInputValue(""); setIsSorted(false); showStatus(`Appended ${inputValue}.`, "success"); } }} />
            <button style={{ ...s.btn, ...s.btnPrimary, opacity: lockUI || !inputValue.trim() || isNaN(Number(inputValue)) ? 0.4 : 1 }}
              disabled={lockUI || !inputValue.trim() || isNaN(Number(inputValue))}
              onClick={() => { const num = Number(inputValue); if (!isNaN(num)) { setArray([...array, num]); setInputValue(""); setIsSorted(false); showStatus(`Appended ${num}.`, "success"); } }}>
              Append
            </button>
          </div>
        </div>

        <div style={s.divider} />

        {/* Delete at index */}
        <div style={s.section}>
          <div style={s.sectionLabel}>Delete at index</div>
          <div style={s.row}>
            <input style={s.input} disabled={lockUI} value={inputValue2} onChange={e => setInputValue2(e.target.value)} placeholder="Index" type="number" />
            <button style={{ ...s.btn, ...s.btnDanger, opacity: lockUI || inputValue2.trim() === "" ? 0.4 : 1 }}
              disabled={lockUI || inputValue2.trim() === ""}
              onClick={() => deleteAtIndex(Number(inputValue2))}>
              Delete
            </button>
          </div>
        </div>

        <div style={s.divider} />

        {/* Insert at index */}
        <div style={s.section}>
          <div style={s.sectionLabel}>Insert at index</div>
          <div style={s.row}>
            <input style={{ ...s.input, width: 72 }} disabled={lockUI} value={indexValue} onChange={e => setIndexValue(e.target.value)} placeholder="Index" type="number" />
            <input style={{ ...s.input, width: 72 }} disabled={lockUI} value={elementValue} onChange={e => setElement(e.target.value)} placeholder="Value" type="number" />
            <button style={{ ...s.btn, ...s.btnSecondary, opacity: lockUI || indexValue.trim() === "" || elementValue.trim() === "" ? 0.4 : 1 }}
              disabled={lockUI || indexValue.trim() === "" || elementValue.trim() === ""}
              onClick={() => insertAtIndex(Number(indexValue), Number(elementValue))}>
              Insert
            </button>
          </div>
        </div>

        <div style={s.divider} />

        {/* Sort */}
        <div style={s.section}>
          <div style={s.sectionLabel}>Sort</div>
          <div style={s.col}>
            <button style={{ ...s.btn, ...s.btnSecondary, opacity: lockUI ? 0.4 : 1 }} disabled={lockUI} onClick={bubblesort}>
              {isSorting ? "Sorting…" : "Bubble sort"}
            </button>
            <button style={{ ...s.btn, ...s.btnGhost, opacity: lockUI ? 0.4 : 1 }} disabled={lockUI} onClick={mergeSort}>
              Merge sort
            </button>
          </div>
        </div>

        <div style={s.divider} />

        {/* Generate */}
        <button style={{ ...s.btn, ...s.btnGhost, opacity: lockUI ? 0.4 : 1, width: "100%" }} disabled={lockUI} onClick={generateRandomArray}>
          <i className="ti ti-refresh" aria-hidden="true" style={{ marginRight: 6 }} />
          Generate random array
        </button>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.stat}><div style={s.statLabel}>Length</div><div style={s.statVal}>{array.length}</div></div>
          <div style={s.stat}><div style={s.statLabel}>Min</div><div style={s.statVal}>{array.length ? Math.min(...array) : "—"}</div></div>
          <div style={s.stat}><div style={s.statLabel}>Max</div><div style={s.statVal}>{array.length ? Math.max(...array) : "—"}</div></div>
        </div>
      </div>

      {/* ── Right: visualizer ──────────────────────────────────── */}
      <div style={s.vizArea}>

        {/* Sorted badge */}
        <div style={{ ...s.sortedBadge, opacity: isSorted ? 1 : 0 }}>
          <i className="ti ti-check" aria-hidden="true" style={{ marginRight: 5 }} />
          Sorted
        </div>

        {/* Bar chart */}
        <div style={s.barChart}>
          {array.map((value, idx) => {
            const isActive = activeIndices.includes(idx);
            const heightPct = (value / maxVal) * 100;
            return (
              <div key={idx} style={s.barWrapper}>
                <div style={s.barValueLabel}>{value}</div>
                <div style={{
                  ...s.bar,
                  height: `${heightPct}%`,
                  background: isActive ? "#FFD700" : isSorted ? "#1D9E75" : "#FF6347",
                  borderColor: isActive ? "#e6c200" : isSorted ? "#0F6E56" : "#c0392b",
                  transition: "height 0.2s ease, background 0.15s",
                }} />
                <div style={s.barIndex}>{idx}</div>
              </div>
            );
          })}
        </div>

        {/* Merge sort frames */}
        {frames.length > 0 && (
          <div style={s.framesArea}>
            <div style={s.framesLabel}>Merge frames</div>
            <div style={s.framesRow}>
              {frames.slice(-4).map((frame, i) => (
                <div key={i} style={s.frameCard}>
                  {frame.join(", ")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#1a1d23",
    padding: "40px 24px",
    gap: 28,
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  //  Panel 
  panel: {
    width: 280,
    flexShrink: 0,
    background: "#20232b",
    border: "0.5px solid #2e323c",
    borderRadius: 14,
    padding: "18px 18px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  panelTitle: { fontSize: 12, fontWeight: 500, color: "#9a9ea8", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 },
  statusBox: { fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "0.5px solid transparent", marginBottom: 14, minHeight: 34, display: "flex", alignItems: "center", transition: "opacity 0.3s" },
  section: { padding: "10px 0", display: "flex", flexDirection: "column", gap: 7 },
  sectionLabel: { fontSize: 11, fontWeight: 500, color: "#5a5f6e", textTransform: "uppercase" as const, letterSpacing: "0.07em" },
  row: { display: "flex", gap: 7, alignItems: "center" },
  col: { display: "flex", flexDirection: "column", gap: 7 },
  input: { flex: 1, padding: "8px 10px", background: "#16181e", border: "0.5px solid #33373f", borderRadius: 8, color: "#ebebeb", fontSize: 13, outline: "none", fontFamily: "inherit", minWidth: 0 },
  btn: { padding: "8px 13px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "0.5px solid transparent", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s, background 0.15s", whiteSpace: "nowrap" as const },
  btnPrimary: { background: "#FF6347", color: "#fff", border: "none" },
  btnDanger: { background: "rgba(226,75,74,0.15)", color: "#E24B4A", border: "0.5px solid rgba(226,75,74,0.3)" },
  btnSecondary: { background: "#2a2e38", color: "#ebebeb", border: "0.5px solid #3a3f4a" },
  btnGhost: { background: "transparent", color: "#9a9ea8", border: "0.5px solid #2e323c" },
  divider: { height: "0.5px", background: "#2a2e38", margin: "4px 0" },
  statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, paddingTop: 14 },
  stat: { background: "#16181e", borderRadius: 8, padding: "7px 10px" },
  statLabel: { fontSize: 11, color: "#5a5f6e", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  statVal: { fontSize: 18, fontWeight: 500, color: "#ebebeb" },

  //  Visualizer 
  vizArea: { flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 },
  sortedBadge: {
    alignSelf: "flex-start",
    fontSize: 12, fontWeight: 500,
    color: "#1D9E75",
    background: "rgba(29,158,117,0.12)",
    border: "0.5px solid rgba(29,158,117,0.3)",
    borderRadius: 20, padding: "4px 12px",
    transition: "opacity 0.4s",
    display: "flex", alignItems: "center",
  },
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 6,
    height: 220,
    background: "#20232b",
    border: "0.5px solid #2e323c",
    borderRadius: 14,
    padding: "16px 16px 0",
    overflowX: "auto",
  },
  barWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: "0 0 auto", width: 44 },
  barValueLabel: { fontSize: 12, color: "#9a9ea8", fontWeight: 500 },
  bar: { width: "100%", borderRadius: "4px 4px 0 0", border: "0.5px solid transparent", minHeight: 4 },
  barIndex: { fontSize: 11, color: "#5a5f6e", padding: "4px 0 8px" },

  framesArea: { display: "flex", flexDirection: "column", gap: 8 },
  framesLabel: { fontSize: 11, fontWeight: 500, color: "#5a5f6e", textTransform: "uppercase" as const, letterSpacing: "0.07em" },
  framesRow: { display: "flex", gap: 8, flexWrap: "wrap" as const },
  frameCard: {
    background: "#20232b",
    border: "0.5px solid #2e323c",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    color: "#9a9ea8",
    fontFamily: "monospace",
  },
};
