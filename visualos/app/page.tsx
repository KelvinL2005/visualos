"use client";
import React, { useState } from "react";

export default function Home() {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [indexValue, setIndexValue] = useState("");
  const [elementValue, setElement] = useState("");


  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const lockUI = isSorting;

  const generateRandomArray = () => {
    if (lockUI) return;
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10) + 1
    );
    setArray(newArray);
  };

  const deleteAtIndex = (index: number) => {
    if (lockUI) return;
    setArray((prev) => prev.filter((_, i) => i !== index));
  };

  const insertAtIndex = (index: number, element: number) => {
    if (lockUI) return;

    if (index < 0 || index > array.length) return;

    const newArray = [...array];
    newArray.splice(index, 0, element);
    setArray(newArray);

    setIndexValue("");
    setElement("");
  };


  const updateAtIndex = (index: number, value: number) => {
    if (lockUI) return;

    if (index < 0 || index >= array.length) return;

    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const playSortedSound = () => {
    const audio = new Audio("/sorted.mp3");
    audio.play().catch(() => {});
  };

  const bubblesort = async () => {
    if (lockUI) return;

    setIsSorting(true);

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
    playSortedSound();
  };

  return (
    <div style={styles.container}>
      {/* Controls */}
      <div style={styles.controls}>
        <button disabled={lockUI} onClick={generateRandomArray} style={buttonStyle(lockUI)}>
          Generate Array
        </button>

        <input
          style={inputStyle(lockUI)}
          disabled={lockUI}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter element"
        />
        <button
          disabled={lockUI}
          style={buttonStyle(lockUI)}
          onClick={() => {
            const num = Number(inputValue);
            if (!isNaN(num)) {
              setArray([...array, num]);
              setInputValue("");
            }
          }}
        >
          Insert
        </button>

        <input
          style={inputStyle(lockUI)}
          disabled={lockUI}
          value={inputValue2}
          onChange={(e) => setInputValue2(e.target.value)}
          placeholder="Delete index"
        />
        <button disabled={lockUI} onClick={() => deleteAtIndex(Number(inputValue2))} style={buttonStyle(lockUI)}>
          Delete
        </button>

        <input
          style={inputStyle(lockUI)}
          disabled={lockUI}
          value={indexValue}
          onChange={(e) => setIndexValue(e.target.value)}
          placeholder="Index"
        />
        <input
          style={inputStyle(lockUI)}
          disabled={lockUI}
          value={elementValue}
          onChange={(e) => setElement(e.target.value)}
          placeholder="Value"
        />
        <button
          disabled={lockUI}
          onClick={() => insertAtIndex(Number(indexValue), Number(elementValue))}
          style={buttonStyle(lockUI)}
        >
          Insert @ Index
        </button>

        <button disabled={lockUI} onClick={bubblesort} style={buttonStyle(lockUI)}>
          Bubble Sort
        </button>
      </div>

      {/* Visualizer */}
      <div style={styles.array}>
        {array.map((value, idx) => (
          <div key={idx} style={styles.boxWrapper}>
            <div
              style={{
                ...styles.box,
                backgroundColor: activeIndices.includes(idx)
                  ? "#FFD700"
                  : "#FF6347",
              }}
            >
              {value}
            </div>
            <div style={styles.index}>{idx}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#282c34",
    gap: "20px",
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    position: "absolute",
    top: 20,
  },
  array: {
    display: "flex",
    gap: "5px",
  },
  boxWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  box: {
    width: 55,
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid white",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  index: {
    color: "white",
    marginTop: "8px",
  },
};

const buttonStyle = (disabled?: boolean) => ({
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: disabled ? "#d3d3d3" : "#f5f5f5",
  color: "#111",
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "all 0.2s ease",
});

const inputStyle = (disabled?: boolean) => ({
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: disabled ? "#d3d3d3" : "#f5f5f5",
  color: "#111",
  width: "120px",
});