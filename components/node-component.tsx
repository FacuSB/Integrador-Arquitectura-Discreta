"use client"

import type React from "react"

import { useState } from "react"
import { X, Trash2, Edit2, Check } from "lucide-react"
import type { NetworkNode } from "@/types/network"

interface NodeComponentProps {
  node: NetworkNode
  color: string
  connections: string[]
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  onPortClick: (port: "top" | "bottom" | "left" | "right", e: React.MouseEvent) => void
  onDelete: () => void
  onRemoveConnection: (toId: string) => void
  onRename: (newLabel: string) => void
  isConnecting: boolean
}

const NODE_ICONS: Record<string, string> = {
  server: "🖥️",
  pc: "💻",
  database: "🗄️",
  storage: "📦",
  router: "🔄",
  firewall: "🛡️",
}

export function NodeComponent({
  node,
  color,
  connections,
  onMouseDown,
  onMouseUp,
  onPortClick,
  onDelete,
  onRemoveConnection,
  onRename,
  isConnecting,
}: NodeComponentProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(node.label)

  const ports: Array<"top" | "bottom" | "left" | "right"> = ["top", "bottom", "left", "right"]

  const portPositions: Record<"top" | "bottom" | "left" | "right", string> = {
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  }

  const handleSaveLabel = () => {
    onRename(editLabel)
    setIsEditing(false)
    setShowMenu(false)
  }

  return (
    <div
      className="absolute w-24 cursor-move select-none group"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onContextMenu={(e) => {
        e.preventDefault()
        setShowMenu(!showMenu)
      }}
    >
      {/* Main Node */}
      <div
        className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center text-white font-semibold transition-all ${
          isConnecting ? "ring-2 ring-blue-400 scale-110" : "hover:scale-105"
        }`}
        style={{ backgroundColor: color }}
      >
        <div className="text-3xl mb-1">{NODE_ICONS[node.type] || "📦"}</div>
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveLabel()}
            className="text-xs text-center px-1 bg-white/20 rounded border border-white text-white placeholder-white/50 w-20"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-xs text-center px-1 truncate">{node.label}</div>
        )}
      </div>

      {/* Connection Ports */}
      {ports.map((port) => (
        <button
          key={port}
          onClick={(e) => {
            e.stopPropagation()
            onPortClick(port, e)
          }}
          className={`absolute w-3 h-3 bg-blue-500 rounded-full hover:bg-blue-600 hover:scale-150 transition-all cursor-crosshair opacity-0 group-hover:opacity-100 ${portPositions[port]}`}
          title={`Conectar por ${port}`}
        />
      ))}

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-2 z-50 min-w-max">
          {isEditing ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSaveLabel()
              }}
              className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-primary hover:text-primary-foreground rounded transition-colors"
            >
              <Check size={14} />
              Guardar
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-primary hover:text-primary-foreground rounded transition-colors"
            >
              <Edit2 size={14} />
              Renombrar
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
              setShowMenu(false)
            }}
            className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
          {connections.length > 0 && (
            <div className="border-t border-border mt-2 pt-2">
              <div className="text-xs text-muted-foreground px-2 py-1 font-semibold">Conexiones</div>
              {connections.map((toId) => (
                <button
                  key={toId}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveConnection(toId)
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1 text-xs hover:bg-destructive hover:text-white rounded transition-colors"
                >
                  <X size={12} />
                  Desconectar
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
