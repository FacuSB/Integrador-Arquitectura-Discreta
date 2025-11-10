"use client"

import { useState } from "react"
import { NetworkCanvas } from "@/components/network-canvas"
import { ComponentPalette } from "@/components/component-palette"
import { DataExporter } from "@/components/data-exporter"
import { GraphVisualization } from "@/components/graph-visualization"
import { dijkstra } from "@/lib/utils"
import type { NetworkNode, NetworkConnection } from "@/types/network"

export default function Home() {
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [fromNode, setFromNode] = useState("")
  const [toNode, setToNode] = useState("")
  const [showGraph, setShowGraph] = useState(false)
  const [shortestPath, setShortestPath] = useState<string[]>([])
  const [showCredits, setShowCredits] = useState(false)

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
    if (!fromNode || !toNode) return
    const result = dijkstra(nodes, connections, fromNode, toNode)
    setShortestPath(result.path)
    setShowGraph(true)
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
          nodes={nodes.map(({ id, label }) => ({ id, label }))}
        />
        <div className="flex-1 flex flex-col">
          <div className="bg-card border-b border-border p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Constructor de Diagramas de Red</h1>
              <p className="text-sm text-muted-foreground">
                Arrastrá componentes al lienzo y hacé click en los puertos para conectar
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowGraph(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Ver Grafo
              </button>
              <button
                onClick={() => setShowCredits(true)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium border border-border"
              >
                Créditos
              </button>
            </div>
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
        path={shortestPath}
      />

      {/* Modal de Créditos */}
      {showCredits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowCredits(false)}
              className="absolute top-2 right-2 p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Alumnos</h2>
            <ul className="mb-4 text-center">
              <li>Mariano Cordeiro</li>
              <li>Blanco Facundo</li>
              <li>Medina Gabriel</li>
              <li>Vanni Giovani</li>
              <li>Mateo Difiore</li>
              <li>Jara Fabricio</li>
            </ul>
            <div className="text-center text-sm text-muted-foreground">Facultad Cuenca del Plata</div>
          </div>
        </div>
      )}
    </main>
  )
}
