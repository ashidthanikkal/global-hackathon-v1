"use client";
import React, { useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

// Define types for the graph data
interface GraphNode {
  id: string;
  position?: { x: number; y: number };
}

interface GraphEdge {
  source: string;
  target: string;
  relation?: string;
}

interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function LearnMapPage() {
  const [text, setText] = useState("");
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });

  // React Flow hooks for managing nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  // Update nodes and edges whenever the graph updates
  useEffect(() => {
    const nodesWithPosition: Node[] = graph.nodes.map((node) => ({
      id: node.id,
      data: { label: node.id },
      position: node.position || { x: Math.random() * 500, y: Math.random() * 500 },
    }));

    const edgesMapped: Edge[] = graph.edges.map((edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      label: edge.relation,
      type: "smoothstep",
      animated: true,
    }));

    setNodes(nodesWithPosition);
    setEdges(edgesMapped);
  }, [graph, setNodes, setEdges]); // Added setNodes and setEdges to dependencies

  const generateGraph = async () => {
    try {
      const res = await axios.post<Graph>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/graph/generate`,
        { text }
      );
      setGraph(res.data);
    } catch (err) {
      console.error("Error generating graph:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">LearnMap 🧠</h1>
      <h5 className="text-lg mb-6 text-green-500 font-semibold">
        Transform course notes into an interactive concept graph for easier understanding and learning.
      </h5>

      <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500">
        <p className="text-black">
          Test: Photosynthesis is the vital process where green plants, algae, and cyanobacteria convert light energy into chemical energy to produce food (sugars) and oxygen from carbon dioxide and water.
        </p>
      </div>

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
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
