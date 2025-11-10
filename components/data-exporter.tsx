"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Download } from "lucide-react"
import type { NetworkNode, NetworkConnection } from "@/types/network"

interface DataExporterProps {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
}

export function DataExporter({ nodes, connections }: DataExporterProps) {
  const [copied, setCopied] = useState(false)
  const [showData, setShowData] = useState(false)

  const networkData = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      label: n.label,
      position: { x: n.x, y: n.y },
    })),
    connections: connections,
    timestamp: new Date().toISOString(),
  }

  const jsonString = JSON.stringify(networkData, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsonString))
    element.setAttribute("download", `network-${Date.now()}.json`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1">
            Red: {nodes.length} nodos, {connections.length} conexiones
          </p>
          <p className="text-xs text-muted-foreground">Exporta los datos en JSON para análisis de grafos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowData(!showData)} variant="outline" size="sm">
            {showData ? "Ocultar" : "Ver"} JSON
          </Button>
          <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Copy size={16} />
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button onClick={handleDownload} variant="default" size="sm" className="gap-2">
            <Download size={16} />
            Descargar
          </Button>
        </div>
      </div>

      {showData && (
        <Card className="mt-4 p-4 bg-muted/50 border-border overflow-x-auto">
          <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
            {jsonString}
          </pre>
        </Card>
      )}
    </div>
  )
}
