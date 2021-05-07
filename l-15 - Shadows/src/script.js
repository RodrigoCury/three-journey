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

// Textures
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = .5
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 10
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(0).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

const dlCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
dlCameraHelper.visible = false
gui.add(dlCameraHelper, 'visible').name('DirectionalHelper')
// scene.add(dlCameraHelper)

const spotlight = new THREE.SpotLight(0xffffff, 0.5, 10)
spotlight.position.set(2, 2, 1)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 1024
spotlight.shadow.mapSize.height = 1024
spotlight.shadow.camera.near = 1
spotlight.shadow.camera.far = 6
spotlight.shadow.camera.fov = 30
scene.add(spotlight, spotlight.target)
gui.add(spotlight, 'intensity').min(0).max(1).step(0.001)
gui.add(spotlight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(spotlight.position, 'y').min(0).max(5).step(0.001)
gui.add(spotlight.position, 'z').min(- 5).max(5).step(0.001)

const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera)
// scene.add(spotlightCameraHelper)
spotlightCameraHelper.visible = true
gui.add(spotlightCameraHelper, 'visible').name('spotlightCameraHelper')

const pointLight = new THREE.PointLight(0xffffff, 0.5, 10)
pointLight.position.set(0, 2, 0)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 1
pointLight.shadow.camera.far = 6
pointLight.shadow.camera.fov = 100
// scene.add(pointLight,)
gui.add(pointLight, 'intensity').min(0).max(1).step(0.001)
gui.add(pointLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(pointLight.position, 'y').min(0).max(5).step(0.001)
gui.add(pointLight.position, 'z').min(- 5).max(5).step(0.001)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(pointLightCameraHelper)
pointLight.shadow.camera.lookAt(new THREE.Vector3(0, 0, 0))
pointLightCameraHelper.visible = true
gui.add(pointLightCameraHelper, 'visible').name('pointLightCameraHelper')

const axes = new THREE.AxesHelper()
scene.add(axes)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true
sphere.receiveShadow = true

const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(.1, 1, .1),
    material)
box.position.set(1.5, 0, 1.5)
box.castShadow = true
box.receiveShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

plane.castShadow = true
plane.receiveShadow = true
scene.add(sphere, plane, box)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = false

renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const movements = {
    xzDistance: 1.3,
    lightRotationSpeed: 2,
    lightUpwardSpeed: 3,
    lightAmplitude: 1.2,
}

gui.add(movements, 'xzDistance').min(0).max(10).step(0.001).name('xzDistance')
gui.add(movements, 'lightRotationSpeed').min(0).max(10).step(0.001).name('lightRotationSpeed')
gui.add(movements, 'lightUpwardSpeed').min(0).max(10).step(0.001).name('lightUpwardSpeed')
gui.add(movements, 'lightAmplitude').min(0).max(10).step(0.001).name('lightAmplitude')

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    box.position.x = Math.sin(elapsedTime) * movements.xzDistance
    box.position.z = Math.cos(elapsedTime) * movements.xzDistance
    // directionalLight.position.x = Math.sin(elapsedTime * movements.lightRotationSpeed) * movements.xzDistance
    // directionalLight.position.z = Math.cos(elapsedTime * movements.lightRotationSpeed) * movements.xzDistance
    // directionalLight.position.y = Math.sin(elapsedTime * movements.lightUpwardSpeed) * movements.lightAmplitude + 1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()