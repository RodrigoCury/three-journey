import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/particles/2.png')
// const texture2 = textureLoader.load('/textures/particles/2.png')
/** 
 * Particles
 */

// Geometry
const size = 20000 * 3
const vertices = new Float32Array(size)
const color = new Float32Array(size)
const rand = THREE.MathUtils.randFloatSpread
const colorPick = THREE.MathUtils.randFloat
const spacing = 10
for (let i = size; i > 0; i--) {
    vertices[i] = rand(spacing)
    color[i] = colorPick(0, 1)
}
const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position',
    new THREE.BufferAttribute(vertices, 3))
// particleGeometry.setAttribute('color',
//     new THREE.BufferAttribute(color, 3))

// const particleGeometry


// Material
const particleMaterial = new THREE.PointsMaterial({
    size: .05,
    sizeAttenuation: true,
    alphaMap: texture,
    transparent: true,
    // alphaTest: 0.01,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // vertexColors: true,
})
// const particleMaterial2 = new THREE.PointsMaterial({
//     size: .05,
//     sizeAttenuation: true,
//     alphaMap: texture2,
//     color: 0x0000ff,
//     transparent: true,
//     alphaTest: 0.001,
// })


// Points
const particles = new THREE.Points(particleGeometry, particleMaterial)
// const particles2 = new THREE.Points(particleGeometry, particleMaterial2)
// particles2.rotation.x = 3.14
scene.add(particles,)
// scene.add(particles2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Particles
    // particles.rotation.y = elapsedTime / 3
    // particles.rotation.x = Math.tan(elapsedTime) / 3

    for (let i = 0; i < size / 3; i++) {
        const i3 = i * 3
        const x = particleGeometry.attributes.position.array[i3]
        const z = particleGeometry.attributes.position.array[i3 + 2]

        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x + z)
    }
    particleGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()