"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import type { NetworkNode, NetworkConnection } from "@/types/network"
import { getPortPosition } from "@/types/network"
import { NodeComponent } from "./node-component"
import { X } from "lucide-react"

interface NetworkCanvasProps {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
  onUpdateNode: (id: string, x: number, y: number) => void
  onDeleteNode: (id: string) => void
  onAddConnection: (from: string, fromPort: string, to: string, toPort: string) => void
  onRemoveConnection: (from: string, to: string) => void
  onRenameNode: (id: string, newLabel: string) => void
  onClearAll: () => void
  onUpdateConnectionWeight: (from: string, to: string, weight: number) => void
}

export function NetworkCanvas({
  nodes,
  connections,
  onUpdateNode,
  onDeleteNode,
  onAddConnection,
  onRemoveConnection,
  onRenameNode,
  onClearAll,
  onUpdateConnectionWeight,
}: NetworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<{
    nodeId: string
    port: "top" | "bottom" | "left" | "right"
  } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [editingEdge, setEditingEdge] = useState<{
    from: string
    to: string
    x: number
    y: number
    weight: number
  } | null>(null)

  const GRID_SIZE = 20

  const getNodeColor = (type: string) => {
    const colors: Record<string, string> = {
      server: "#a855f7",
      pc: "#3b82f6",
      database: "#22c55e",
      storage: "#f97316",
      router: "#ef4444",
      firewall: "#06b6d4",
    }
    return colors[type] || "#6b7280"
  }

  const snapToGrid = (value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 0.5

    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw connections
    ctx.strokeStyle = "#06b6d4"
    ctx.lineWidth = 2.5

    connections.forEach((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from)
      const toNode = nodes.find((n) => n.id === conn.to)
      if (fromNode && toNode) {
        const fromPos = getPortPosition(fromNode.x, fromNode.y, conn.fromPort)
        const toPos = getPortPosition(toNode.x, toNode.y, conn.toPort)
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)
        ctx.stroke()
        // Dibujar el peso en el medio de la arista
        if (typeof conn.weight === "number") {
          const midX = (fromPos.x + toPos.x) / 2
          const midY = (fromPos.y + toPos.y) / 2
          ctx.save()
          ctx.font = "bold 14px sans-serif"
          ctx.fillStyle = "#0f172a"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(String(conn.weight), midX, midY - 10)
          ctx.restore()
        }
      }
    })

    if (connecting) {
      const fromNode = nodes.find((n) => n.id === connecting.nodeId)
      if (fromNode) {
        const fromPos = getPortPosition(fromNode.x, fromNode.y, connecting.port)
        ctx.strokeStyle = "#3b82f6"
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }, [nodes, connections, connecting, mousePos])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePos({ x, y })

    if (draggedNode) {
      const snappedX = snapToGrid(x - 48)
      const snappedY = snapToGrid(y - 48)
      onUpdateNode(draggedNode, snappedX, snappedY)
    }
  }

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (e.button === 0) {
      setDraggedNode(nodeId)
    }
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
  }

  const handlePortClick = (nodeId: string, port: "top" | "bottom" | "left" | "right", e: React.MouseEvent) => {
    e.stopPropagation()

    if (!connecting) {
      setConnecting({ nodeId, port })
    } else if (connecting.nodeId !== nodeId) {
      onAddConnection(connecting.nodeId, connecting.port, nodeId, port)
      setConnecting(null)
    }
  }

  const handleCanvasClick = () => {
  setConnecting(null)
  setEditingEdge(null)
  }

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={1400}
        height={700}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0"
        onDoubleClick={(e) => {
          const canvas = canvasRef.current
          if (!canvas) return
          const rect = canvas.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          // Detectar si se hizo doble click cerca de una arista
          let found = null
          connections.forEach((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.from)
            const toNode = nodes.find((n) => n.id === conn.to)
            if (fromNode && toNode) {
              const fromPos = getPortPosition(fromNode.x, fromNode.y, conn.fromPort)
              const toPos = getPortPosition(toNode.x, toNode.y, conn.toPort)
              // Calcular distancia punto a segmento
              const dx = toPos.x - fromPos.x
              const dy = toPos.y - fromPos.y
              const length = Math.sqrt(dx * dx + dy * dy)
              const t = ((x - fromPos.x) * dx + (y - fromPos.y) * dy) / (length * length)
              const nearestX = fromPos.x + t * dx
              const nearestY = fromPos.y + t * dy
              const dist = Math.sqrt((x - nearestX) ** 2 + (y - nearestY) ** 2)
              if (dist < 20 && t >= 0 && t <= 1) {
                found = { from: conn.from, to: conn.to, x: nearestX, y: nearestY, weight: conn.weight }
              }
            }
          })
          if (found) {
            setEditingEdge(found)
          }
        }}
      />
      {editingEdge && (
        <div
          style={{
            position: "absolute",
            left: editingEdge.x - 40,
            top: editingEdge.y - 10,
            zIndex: 20,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "4px 8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <input
            type="number"
            min={1}
            value={editingEdge.weight}
            style={{ width: 50, marginRight: 4 }}
            onChange={e => {
              const val = Number(e.target.value)
              setEditingEdge({ ...editingEdge, weight: val })
            }}
          />
          <button
            style={{ padding: "2px 8px", borderRadius: 4, background: "#06b6d4", color: "#fff", border: "none" }}
            onClick={() => {
              if (editingEdge.weight > 0) {
                onUpdateConnectionWeight(editingEdge.from, editingEdge.to, editingEdge.weight)
                setEditingEdge(null)
              }
            }}
          >Guardar</button>
          <button
            style={{ padding: "2px 8px", borderRadius: 4, background: "#eee", color: "#333", border: "none" }}
            onClick={() => setEditingEdge(null)}
          >Cancelar</button>
        </div>
      )}
      <button
        onClick={onClearAll}
        className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors z-10 flex items-center gap-2"
        title="Reiniciar diagrama"
      >
        <X size={20} />
        <span className="text-sm font-medium">Reiniciar</span>
      </button>
      {nodes.map((node) => (
        <NodeComponent
          key={node.id}
          node={node}
          color={getNodeColor(node.type)}
          connections={connections.filter((c) => c.from === node.id).map((c) => c.to)}
          onMouseDown={(e) => handleMouseDown(node.id, e)}
          onMouseUp={handleMouseUp}
          onPortClick={(port, e) => handlePortClick(node.id, port, e)}
          onDelete={() => onDeleteNode(node.id)}
          onRemoveConnection={(toId) => onRemoveConnection(node.id, toId)}
          onRename={(newLabel) => onRenameNode(node.id, newLabel)}
          isConnecting={connecting?.nodeId === node.id}
        />
      ))}
    </div>
  )
}
