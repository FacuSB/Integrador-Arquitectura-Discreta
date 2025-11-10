export interface NetworkNode {
  id: string
  type: string
  x: number
  y: number
  label: string
}

export interface NetworkConnection {
  from: string
  fromPort: "top" | "bottom" | "left" | "right" // Added port information
  to: string
  toPort: "top" | "bottom" | "left" | "right"
}

export function getPortPosition(nodeX: number, nodeY: number, port: "top" | "bottom" | "left" | "right") {
  const width = 96 // w-24 = 96px
  const height = 96 // h-24 = 96px

  switch (port) {
    case "top":
      return { x: nodeX + width / 2, y: nodeY }
    case "bottom":
      return { x: nodeX + width / 2, y: nodeY + height }
    case "left":
      return { x: nodeX, y: nodeY + height / 2 }
    case "right":
      return { x: nodeX + width, y: nodeY + height / 2 }
  }
}
