import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
const waterVertexShader = require('./shaders/water/vertex.glsl').default
const waterFragmentShader = require('./shaders/water/fragment.glsl').default

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(8, 8, 256, 256)

// Material
debugObject.depthColor = '#040439'
debugObject.surfaceColor = '#6bbaf2'

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    transparent: true,
    side: 2,
    uniforms: {
        uTime: { value: 0 },

        uBigWaveElevation: { value: 0.2 },
        uBigWaveFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWaveSpeed: { value: 1.5 },
        uSmallWavesSpeedMultiplier: { value: 0.227 },
        uSmallWavesFrequency: { value: 3.2 },
        uSmallWavesAmplitude: { value: 0.115 },
        uSmallWavesIterations: { value: 7.0 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.25 },
        uColorMultiplier: { value: 2.541 },
    }
})

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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
 * Debug
 */
gui.add(waterMaterial.uniforms.uBigWaveElevation, 'value').min(0).max(1).step(0.001).name("bigWaveElevation")
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'x').min(0).max(10).step(0.001).name("BigFreq X")
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'y').min(0).max(10).step(0.001).name("BigFreq Y")
gui.add(waterMaterial.uniforms.uBigWaveSpeed, 'value').min(0).max(4).step(0.001).name("bigWaveSpeed")
gui.add(waterMaterial.uniforms.uSmallWavesSpeedMultiplier, 'value').min(0).max(1).step(0.001).name("uSmallWavesSpeedMultiplier")
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(6).step(0.001).name("uSmallWavesFrequency")
gui.add(waterMaterial.uniforms.uSmallWavesAmplitude, 'value').min(0).max(0.25).step(0.0001).name("uSmallWavesAmplitude")
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(1).name("uSmallWavesIterations")
gui.addColor(debugObject, 'depthColor').onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor))
gui.addColor(debugObject, 'surfaceColor').onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor))
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(2).step(0.001).name("ColorOffset")
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(8).step(0.001).name("ColorMultiplier")
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // Update Material
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()