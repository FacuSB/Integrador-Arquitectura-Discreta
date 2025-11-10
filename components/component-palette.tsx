"use client"
import { Button } from "@/components/ui/button"

const COMPONENT_TYPES = [
  { id: "server", label: "Servidor", icon: "🖥️", color: "bg-purple-500" },
  { id: "pc", label: "PC", icon: "💻", color: "bg-blue-500" },
  { id: "database", label: "Base de Datos", icon: "🗄️", color: "bg-green-500" },
  { id: "router", label: "Router", icon: "🔄", color: "bg-red-500" },
]

interface ComponentPaletteProps {
  onAddComponent: (type: string) => void
  fromNode: string
  toNode: string
  onFromNodeChange: (value: string) => void
  onToNodeChange: (value: string) => void
  onSearch: () => void
  nodes: { id: string; label: string }[]
}

export function ComponentPalette({
  onAddComponent,
  fromNode,
  toNode,
  onFromNodeChange,
  onToNodeChange,
  onSearch,
  nodes,
}: ComponentPaletteProps) {
  return (
    <div className="w-full md:w-48 bg-card border-r border-border p-4 overflow-y-auto flex flex-col">
      <div>
  <h2 className="text-lg font-semibold mb-4">Componentes</h2>
        <div className="space-y-2 mb-6">
          {COMPONENT_TYPES.map((type) => (
            <Button
              key={type.id}
              onClick={() => onAddComponent(type.id)}
              variant="outline"
              className="w-full justify-start text-left"
            >
              <span className="mr-2">{type.icon}</span>
              <span className="flex-1">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4 mt-auto">
  <h3 className="text-sm font-semibold mb-3">Camino más corto</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Desde</label>
            <select
              value={fromNode}
              onChange={(e) => onFromNodeChange(e.target.value)}
              className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar nodo</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.label} ({node.id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Hasta</label>
            <select
              value={toNode}
              onChange={(e) => onToNodeChange(e.target.value)}
              className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar nodo</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.label} ({node.id})
                </option>
              ))}
            </select>
          </div>
          <Button onClick={onSearch} className="w-full text-xs">
            Buscar
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Ver IDs en exportar</p>
        </div>
      </div>
    </div>
  )
}
