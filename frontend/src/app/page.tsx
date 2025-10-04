"use client";
import React, { useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

export default function LearnMapPage() {
  const [text, setText] = useState("");
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  const generateGraph = async () => {
    const res = await axios.post("http://localhost:8000/graph/generate", { text });
    setGraph(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">LearnMap 🧠</h1>

      <textarea
        className="w-full h-40 p-3 border rounded mb-4"
        placeholder="Paste your course notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generateGraph}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Graph
      </button>

      <div className="h-[600px] mt-6 border rounded">
        <ReactFlow nodes={graph.nodes} edges={graph.edges}>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
