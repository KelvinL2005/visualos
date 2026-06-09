"use client";

import React, { useState } from "react";

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

export default function StackPage() {
    const [stack, setStack] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [pushElement, setPushElement] = useState("");


    const peek = () => {
        if (stack.length === 0) {
            alert("Stack is empty! Cannot peek from an empty stack.");
            return;
        }
        alert(`Top element: ${stack[stack.length - 1]}`);
    };


    const pushToStack = (element: string) => {
        const num = Number(element);
        if (!isNaN(num)) {
            setStack([...stack, num]);
            setPushElement(""); // Clear input after push
        }
    };

    const popStack = () => {
        if (stack.length === 0) {

            alert("Stack is empty! Cannot pop from an empty stack.");
            return;
        }
        setStack(prev => prev.slice(0, -1))

    };

    return (
        <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#282c34" }}
        >
            {/* Stack visualizer*/}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0px",
            }}>
                {stack.slice().reverse().map((item, index) => (
                    <div key={`${item}-${index}`}>
                        {index === 0 && (
                            <div
                                style={{
                                    color: "#FFD700",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    marginBottom: "4px",
                                }}
                            >
                                TOP
                            </div>
                        )}

                        <div
                            style={{
                                padding: "10px",
                                border: "1px solid #ccc",
                                width: "100px",
                                textAlign: "center",
                                backgroundColor: index === 0 ? "#E68A19" : "#FF6347",
                            }}
                        >
                            {item}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                position: "fixed",
                top: "20px",
                display: "flex",
                gap: "8px",
                zIndex: 100,
            }}>
                {/* Controls */}
                <input
                    style={inputStyle()}
                    onChange={(e) => setPushElement(e.target.value)}
                    value={pushElement}
                    placeholder="Element"
                />
                <button
                    disabled={
                        pushElement.trim() === "" ||
                        isNaN(Number(pushElement))
                    }

                    style={buttonStyle(pushElement.trim() === "" || isNaN(Number(pushElement)))}
                    onClick={() => pushToStack(pushElement)}

                >
                    Push
                </button>

                <button
                    disabled={stack.length === 0}
                    style={buttonStyle(stack.length === 0)}
                    onClick={() => popStack()}
                >
                    Pop
                </button>

                <button
                    disabled={stack.length === 0}
                    onClick={peek}
                    style={buttonStyle(stack.length === 0)}
                >
                    Peek </button>

                <div style={{ color: "white", marginTop: "10px" }}>
                    Size: {stack.length}
                </div>
                

            </div>
        </div>
    );
}