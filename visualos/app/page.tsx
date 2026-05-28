"use client";
import React, { useState } from "react";

export default function Home() {
  const [elementValue, setElement] = useState("");
  const [indexValue, setIndexValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const deleteAtIndex = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10) + 1
    );
    setArray(newArray);
  };

  function insertAtIndex(index: number, element: number) {
    if (!(index >= 0 && index <= array.length)) {
      alert(
        "Index out of bounds. Please enter a valid index between 0 and " +
          array.length
      );
      return;
    }
    if (!isNaN(index) && !isNaN(element)) {
      const newArray = [...array];
      newArray.splice(index, 0, element);
      setArray(newArray);

      setIndexValue("");
      setElement("");
    }
  }

  function swap(i: number, j: number) {
    const newArray = [...array];
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements at indices i and j
    setArray(newArray);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "20px",
        backgroundColor: "#282c34",
      }}
    >
      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          position: "absolute",
          top: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={generateRandomArray}
          style={{
            padding: "10px 15px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Generate Array
        </button>

        {/* Insert Element */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter element"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "2px solid white",
              backgroundColor: "#fff",
              color: "#000",
            }}
          />

          <button
            onClick={() => {
              const num = Number(inputValue);
              if (!isNaN(num) && inputValue !== "") {
                setArray([...array, num]);
                setInputValue("");
              }
            }}
            style={{
              cursor: "pointer",
              border: "2px solid white",
              backgroundColor: "#fff",
              color: "#000",
              padding: "10px 15px",
              borderRadius: "6px",
            }}
          >
            Insert Element
          </button>
        </div>

        {/* Delete Index */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            placeholder="Enter index to delete"
            style={{
              padding: "10px 15px",
              backgroundColor: "white",
              color: "black",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          />

          <button
            onClick={() => deleteAtIndex(Number(inputValue2))}
            style={{
              cursor: "pointer",
              border: "2px solid white",
              backgroundColor: "#fff",
              color: "#000",
              padding: "10px 15px",
              borderRadius: "6px",
            }}
          >
            Delete Index
          </button>
        </div>

        {/* Insert at Index */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            value={indexValue}
            onChange={(e) => setIndexValue(e.target.value)}
            placeholder="Enter index"
            style={{
              padding: "10px 15px",
              backgroundColor: "white",
              color: "black",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          />

          <input
            value={elementValue}
            onChange={(e) => setElement(e.target.value)}
            placeholder="Enter element"
            style={{
              padding: "10px 15px",
              backgroundColor: "white",
              color: "black",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          />

          <button
            onClick={() =>
              insertAtIndex(Number(indexValue), Number(elementValue))
            }
            style={{
              cursor: "pointer",
              border: "2px solid white",
              backgroundColor: "#fff",
              color: "#000",
              padding: "10px 15px",
              borderRadius: "6px",
            }}
          >
            Insert at Index
          </button>
        </div>
      </div>

      {/* Array Visualizer */}
      <div style={{ display: "flex", gap: "0px" }}>
        {array.map((value, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 55,
                height: 55,
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "18px",
                backgroundColor: "#FF6347",
                color: "white",
                borderRadius: "5px",
              }}
            >
              {value}
            </div>
            <div
              style={{ fontSize: "18px", color: "white", marginTop: "10px" }}
            >
              {idx}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}