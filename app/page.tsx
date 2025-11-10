"use client"

import { useState } from "react"
import { NetworkCanvas } from "@/components/network-canvas"
import { ComponentPalette } from "@/components/component-palette"
import { DataExporter } from "@/components/data-exporter"
import { GraphVisualization } from "@/components/graph-visualization"
import type { NetworkNode, NetworkConnection } from "@/types/network"

export default function Home() {
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [fromNode, setFromNode] = useState("")
  const [toNode, setToNode] = useState("")
  const [showGraph, setShowGraph] = useState(false)

  const addNode = (type: string) => {
    const newNode: NetworkNode = {
      id: `${type}-${Date.now()}`,
      type,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      label: `${type} ${nodes.filter((n) => n.type === type).length + 1}`,
    }
    setNodes([...nodes, newNode])
  }

  const updateNode = (id: string, x: number, y: number) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, x, y } : n)))
  }

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id))
    setConnections(connections.filter((c) => c.from !== id && c.to !== id))
  }

  const renameNode = (id: string, newLabel: string) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, label: newLabel } : n)))
  }

  const addConnection = (from: string, fromPort: string, to: string, toPort: string) => {
    if (
      from !== to &&
      !connections.some((c) => c.from === from && c.to === to && c.fromPort === fromPort && c.toPort === toPort)
    ) {
      setConnections([
        ...connections,
        {
          from,
          fromPort: fromPort as "top" | "bottom" | "left" | "right",
          to,
          toPort: toPort as "top" | "bottom" | "left" | "right",
        },
      ])
    }
  }

  const removeConnection = (from: string, to: string) => {
    setConnections(connections.filter((c) => !(c.from === from && c.to === to)))
  }

  const clearAll = () => {
    if (window.confirm("¿Estás seguro de que quieres reiniciar todo el diagrama?")) {
      setNodes([])
      setConnections([])
      setFromNode("")
      setToNode("")
    }
  }

  const handleSearch = () => {
    console.log("[v0] Path search from:", fromNode, "to:", toNode, "Nodes:", nodes, "Connections:", connections)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        <ComponentPalette
          onAddComponent={addNode}
          fromNode={fromNode}
          toNode={toNode}
          onFromNodeChange={setFromNode}
          onToNodeChange={setToNode}
          onSearch={handleSearch}
        />
        <div className="flex-1 flex flex-col">
          <div className="bg-card border-b border-border p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Network Diagram Builder</h1>
              <p className="text-sm text-muted-foreground">
                Arrastra componentes al lienzo, haz click en los puertos para conectar
              </p>
            </div>
            <button
              onClick={() => setShowGraph(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Ver Grafo
            </button>
          </div>
          <div className="flex-1 relative overflow-hidden bg-muted/10">
            <NetworkCanvas
              nodes={nodes}
              connections={connections}
              onUpdateNode={updateNode}
              onDeleteNode={deleteNode}
              onAddConnection={addConnection}
              onRemoveConnection={removeConnection}
              onRenameNode={renameNode}
              onClearAll={clearAll}
            />
          </div>
          <DataExporter nodes={nodes} connections={connections} />
        </div>
      </div>
      <GraphVisualization
        nodes={nodes}
        connections={connections}
        isOpen={showGraph}
        onClose={() => setShowGraph(false)}
      />
    </main>
  )
}
