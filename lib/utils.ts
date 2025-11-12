// Algoritmo de Dijkstra para encontrar el camino más corto
import type { NetworkConnection } from "@/types/network"

export function dijkstra(
  nodes: { id: string }[],
  connections: NetworkConnection[],
  startId: string,
  endId: string
): { path: string[]; distance: number } {
  const distances: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  const unvisited = new Set(nodes.map((n) => n.id))

  nodes.forEach((n) => {
    distances[n.id] = n.id === startId ? 0 : Infinity
    prev[n.id] = null
  })

  while (unvisited.size > 0) {
    let current: string | null = null
    let minDist = Infinity
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDist) {
        minDist = distances[nodeId]
        current = nodeId
      }
    }
    if (current === null || distances[current] === Infinity) break
    if (current === endId) break
    unvisited.delete(current)

    // Buscar vecinos y considerar el peso
    const outgoing = connections.filter((c) => c.from === current)
    for (const conn of outgoing) {
      const neighbor = conn.to
      if (!unvisited.has(neighbor)) continue
      const weight = typeof conn.weight === "number" && conn.weight > 0 ? conn.weight : 1
      const alt = distances[current] + weight
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt
        prev[neighbor] = current
      }
    }
  }

  // Reconstruir camino
  const path: string[] = []
  let u: string | null = endId
  if (prev[u] !== null || u === startId) {
    while (u) {
      path.unshift(u)
      u = prev[u]
    }
  }
  return { path, distance: distances[endId] }
}
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
