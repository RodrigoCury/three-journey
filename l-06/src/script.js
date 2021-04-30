import './style.css'
import * as THREE from 'three'
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group()
scene.add(group)

// const geometry = new THREE.SphereBufferGeometry(1, 128, 128)
const geometry = new THREE.IcosahedronGeometry(1)
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: .95,
    roughness: 0
})
const mesh = new THREE.Mesh(geometry, material)
// mesh.scale.set(0.7, .7, .7)
group.add(mesh)

const point1 = new THREE.PointLight(0xff0000, 7)
group.add(point1)
const point2 = new THREE.PointLight(0x0000ff, 7)
group.add(point2)

const ambient = new THREE.PointLight(0xffffff, 1)
ambient.position.z = 2
scene.add(ambient)
const ambient2 = new THREE.PointLight(0xffffff, 1)
ambient2.position.z = 2
scene.add(ambient2)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animations



let timestamp = new THREE.Clock()

const tick = () => {
    // Update Objects related to time
    const elapsedTime = timestamp.getElapsedTime()

    group.position.y = Math.sin(elapsedTime)
    group.position.x = Math.cos(elapsedTime)

    camera.position.y = Math.cos(elapsedTime) * 2
    camera.position.x = Math.sin(elapsedTime) * 2

    point1.position.y = Math.cos(elapsedTime) * 5
    point1.position.x = Math.sin(elapsedTime)
    point2.position.y = -Math.cos(elapsedTime) * 5
    point2.position.x = -Math.sin(elapsedTime)
    ambient.position.y = Math.tan(elapsedTime)
    ambient.position.z = Math.cos(elapsedTime * 2) * 2
    ambient.position.y = Math.atan(elapsedTime)
    ambient.position.z = Math.sin(elapsedTime * 2) * 2
    camera.lookAt(group.position)
    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()