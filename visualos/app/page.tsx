"use client";
import React, { useState } from "react";

export default function Home() {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const generateRandomArray = () => { // Generate a random array of 10 elements between 1 and 10
    const newArray = Array.from({ length: 10 }, () => 
      Math.floor(Math.random() * 10) + 1// Generate a random number between 1 and 10
    );
    setArray(newArray); // Update the state with the new random array, which will trigger a re-render to show the updated array
  };

  // Insert element (not wired yet, but ready)
function insertElement(element: number): void {
  const newArray = [...array]; // create a copy of the current array to avoid mutating state directly
  newArray.push(element); // add the new element to the end of the array
  setArray(newArray); // update the state with the new array, which will trigger a re-render to show the updated array
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
      <div style={{ display: "flex", gap: "12px", position: "absolute", top: 20 }}>
        <button
          onClick={generateRandomArray} // onClick event to trigger the generation of a new random array
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

        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Insert Element
        </button>
      </div>

      {/* Array Visualizer */}
      <div style={{ display: "flex", gap: "0px" }}>
        {array.map((value, idx) => ( // array.map to render each element in the array turns data to UI elements
          <div
            key={idx} // keys help track changes in the array and optimize rendering
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
            <div style={{ fontSize: "18px", color: "white", marginTop: "10px" }}>
              {idx}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



