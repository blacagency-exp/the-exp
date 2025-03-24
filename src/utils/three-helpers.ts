import * as THREE from "three"

// Convert spherical coordinates to Cartesian coordinates
export function sphericalToCartesian(radius: number, phi: number, theta: number): THREE.Vector3 {
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

// Convert pitch and yaw to a position on a sphere
export function pitchYawToPosition(pitch: number, yaw: number, radius = 500): string {
  // Convert degrees to radians
  const pitchRad = THREE.MathUtils.degToRad(pitch)
  const yawRad = THREE.MathUtils.degToRad(yaw)

  // Calculate position
  const x = radius * Math.cos(pitchRad) * Math.sin(yawRad)
  const y = radius * Math.sin(pitchRad)
  const z = -radius * Math.cos(pitchRad) * Math.cos(yawRad)

  return `${x} ${y} ${z}`
}

// Create a text sprite for hotspot labels
export function createTextSprite(text: string, size = 1): THREE.Sprite {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 128

  const context = canvas.getContext("2d")
  if (!context) throw new Error("Could not get canvas context")

  context.fillStyle = "rgba(0, 0, 0, 0.7)"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.font = "bold 24px Arial"
  context.fillStyle = "white"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  })

  const sprite = new THREE.Sprite(material)
  sprite.scale.set(size * 10, size * 5, 1)

  return sprite
}

