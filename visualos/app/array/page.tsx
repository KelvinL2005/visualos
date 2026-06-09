"use client";
import React, { useState } from "react";

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
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const lockUI = isSorting;

  const generateRandomArray = () => {
    setIsSorted(false); // Reset sorted state when generating new array
    if (lockUI) return; // Prevent generating new array if UI is locked
    const newArray = Array.from({ length: 10 }, () => // Generate 10 random numbers between 1 and 10
      Math.floor(Math.random() * 10) + 1
    );
    setArray(newArray); // Update state with the new random array
  };

  const deleteAtIndex = (index: number) => {
    setIsSorted(false); // Reset sorted state when deleting an element
    if (lockUI) return; // Prevent deleting if UI is locked
    setArray((prev) => prev.filter((_, i) => i !== index));// Remove element at specified index
  };

  const insertAtIndex = (index: number, element: number) => {
    setIsSorted(false);
    if (lockUI) return;

    if (index < 0 || index > array.length) return;

    const newArray = [...array];
    newArray.splice(index, 0, element);
    setArray(newArray);

    setIndexValue("");
    setElement("");
  };


  const updateAtIndex = (index: number, value: number) => {
    setIsSorted(false); // Reset sorted state when updating an element
    if (lockUI) return; // Prevent updating if UI is locked

    if (index < 0 || index >= array.length) return; // Validate index

    const newArray = [...array];
    newArray[index] = value; // Update element at specified index
    setArray(newArray); // Update state with the modified array
  };

  const playSortedSound = () => {
    const audio = new Audio("/sorted.mp3");
    audio.play().catch(() => {});
  };

  const bubblesort = async () => {
    if (lockUI) return; // Prevent sorting if UI is locked

    setIsSorting(true); // Lock UI during sorting
    setIsSorted(false); // Reset sorted state at start of sorting
    const arr = [...array]; // Create a copy of the array to sort
    const n = arr.length; // Get the length of the array

    for (let i = 0; i < n - 1; i++) { // Outer loop to control the number of passes
      for (let j = 0; j < n - i - 1; j++) { // Inner loop to compare adjacent elements
        setActiveIndices([j, j + 1]);
        await delay(300);

        if (arr[j] > arr[j + 1]) { // Compare adjacent elements and swap if they are in the wrong order
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap elements if they are in the wrong order
          setArray([...arr]);
          await delay(300);
        }
      }
    }

    setActiveIndices([]);
    setIsSorting(false);
    setIsSorted(true);
    playSortedSound();
  };

  const mergeSort = async () => {
    if (isSorting) return;
  
    setIsSorting(true);
    setIsSorted(false);
    setFrames([]); // Clear frames at start
  
    const arr = [...array];
  
    const sort = async (input: number[]): Promise<number[]> => {
      if (input.length <= 1) return input;
  
      const mid = Math.floor(input.length / 2);
  
      const left = await sort(input.slice(0, mid));
      const right = await sort(input.slice(mid));
  
      // Show the current left and right being merged
      setFrames(prev => [...prev, left, right]);
      await delay(400);
  
      return await merge(left, right);
    };
  
    const merge = async (left: number[], right: number[]) => {
      const result: number[] = [];
      let l = 0, r = 0;
  
      while (l < left.length && r < right.length) { // Merge left and right while showing the current state
        if (left[l] < right[r]) {
          result.push(left[l++]);
        } else {
          result.push(right[r++]);
        }
        setFrames(prev => [...prev, [...result, ...left.slice(l), ...right.slice(r)]]); // Show the current merged result along with remaining left and right
        await delay(400);
      }
      while (l < left.length) {
        result.push(left[l++]);
        setFrames(prev => [...prev, [...result, ...left.slice(l), ...right.slice(r)]]); // Show the current merged result along with remaining left and right
        await delay(400);
      }
      while (r < right.length) {
        result.push(right[r++]);
        setFrames(prev => [...prev, [...result, ...left.slice(l), ...right.slice(r)]]); // Show the current merged result along with remaining left and right
        await delay(400);
      }
      return result;
    };
  
    const sorted = await sort(arr); // Get the fully sorted array after merge sort completes
  
    setArray(sorted);
    setFrames([]);
    setActiveIndices([]);
    setIsSorting(false);
    setIsSorted(true);
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


        <button disabled={lockUI} onClick={mergeSort} style={buttonStyle(lockUI)}>
          Merge Sort
        </button>
        
      </div>

      {/* Visualizer */}
      {/* Merge Sort Frames Visualizer */}
      <div style={{ display: "flex", gap: "12px", margin: "16px 0" }}>
        {frames.slice(-4).map((frame, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }}>
            {frame.join(", ")}
          </div>
        ))}
      </div>
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

      <div>
              <label style={{ color: isSorted ? "#32CD32" : "white", fontWeight: "bold", fontSize: "18px" }}
              >Sorted</label>
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