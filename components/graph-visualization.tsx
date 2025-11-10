"use client"

import { useEffect, useRef, useState } from "react"
import type { NetworkNode, NetworkConnection } from "@/types/network"
import { X } from "lucide-react"

interface GraphVisualizationProps {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
  isOpen: boolean
  onClose: () => void
  path?: string[]
}

export function GraphVisualization({ nodes, connections, isOpen, onClose, path }: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cy, setCy] = useState<any>(null)

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

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
          {
            selector: ".highlighted",
            style: {
              "background-color": "#f59e42",
              "line-color": "#f59e42",
              "target-arrow-color": "#f59e42",
              "transition-property": "background-color, line-color, target-arrow-color",
              "transition-duration": 0.5,
            },
          },
        ],
        layout: {
          name: "cose",
          animate: true,
          animationDuration: 500,
        },
      })

      nodes.forEach((node) => {
        cy.add({
          data: { id: node.id, label: node.label },
        })
      })
      connections.forEach((conn) => {
        cy.add({
          data: { id: `${conn.from}-${conn.to}`, source: conn.from, target: conn.to },
        })
      })

  cy.layout({ name: "cose", animate: true }).run()
      setCy(cy)

      return () => {
        cy.destroy()
      }
    })
  }, [isOpen, nodes, connections])

  // Animar el camino más corto
  useEffect(() => {
    if (!cy || !path || path.length < 2) return
    cy.elements().removeClass("highlighted")
    let i = 0
    function highlightStep() {
      if (!path || i >= path.length) return
      cy.getElementById(path[i]).addClass("highlighted")
      if (i > 0 && path) {
        const edgeId = `${path[i - 1]}-${path[i]}`
        const edge = cy.getElementById(edgeId)
        if (edge) edge.addClass("highlighted")
      }
      i++
      setTimeout(highlightStep, 400)
    }
    highlightStep()
    return () => {
      cy.elements().removeClass("highlighted")
    }
  }, [cy, path])

  if (!isOpen) return null

  // El modal se posiciona igual que el área de diagrama builder (flex-1)
  return (
    <div className="absolute inset-0 z-50 flex">
      {/* Sidebar placeholder para alinear igual que el builder */}
      <div className="w-48" />
      <div className="flex-1 flex flex-col bg-card rounded-lg shadow-xl border border-border m-4">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold">Visualización del grafo de red</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div ref={containerRef} className="flex-1" />
      </div>
    </div>
  )
}
