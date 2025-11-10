"use client"

import { useEffect, useRef, useState } from "react"
import type { NetworkNode, NetworkConnection } from "@/types/network"
import { X } from "lucide-react"

interface GraphVisualizationProps {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
  isOpen: boolean
  onClose: () => void
}

export function GraphVisualization({ nodes, connections, isOpen, onClose }: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cy, setCy] = useState<any>(null)

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    // Dynamically import Cytoscape
    import("cytoscape").then((cytoscape) => {
      const cy = cytoscape.default({
        container: containerRef.current,
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#06b6d4",
              label: "data(label)",
              "text-valign": "center",
              "text-halign": "center",
              width: 60,
              height: 60,
              "font-size": 12,
              color: "#ffffff",
              "border-width": 2,
              "border-color": "#0891b2",
            },
          },
          {
            selector: "edge",
            style: {
              "line-color": "#06b6d4",
              "target-arrow-color": "#06b6d4",
              width: 2,
            },
          },
        ],
        layout: {
          name: "cose",
          directed: false,
          animate: true,
          animationDuration: 500,
        },
      })

      // Add nodes
      nodes.forEach((node) => {
        cy.add({
          data: { id: node.id, label: node.label },
        })
      })

      // Add edges
      connections.forEach((conn) => {
        cy.add({
          data: { id: `${conn.from}-${conn.to}`, source: conn.from, target: conn.to },
        })
      })

      cy.layout({ name: "cose", directed: false, animate: true }).run()
      setCy(cy)

      return () => {
        cy.destroy()
      }
    })
  }, [isOpen, nodes, connections])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold">Network Graph Visualization</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div ref={containerRef} className="flex-1" />
      </div>
    </div>
  )
}
