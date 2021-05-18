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
 * Objects
 */
const sphereGroup = new THREE.Group()
scene.add(sphereGroup)

const object1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.name = "#3"
object3.position.x = 2

sphereGroup.add(object1, object2, object3)

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(1, 0, 0)
// raycaster.set(rayOrigin, rayDirection)

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
/**
 * Cursor
 */

const cursor = new THREE.Vector2(0, 0)

window.addEventListener('mousemove', event => {
    cursor.x = event.clientX / sizes.width * 2 - 1
    cursor.y = -(event.clientY / sizes.height) * 2 + 1
})
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

const pointCounter = document.querySelector('h1.points')

let raycasterWitness = null
let point = parseInt(pointCounter.innerHTML)

window.addEventListener('click', event => {
    if (raycasterWitness) {
        point += 1
        pointCounter.innerHTML = point
    }
})

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Points

    // Animate Objects

    object1.position.y = Math.sin(elapsedTime * .5) * 1.5
    object2.position.y = Math.cos(elapsedTime * .8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.3) * 1.5


    raycaster.setFromCamera(cursor, camera)


    const intersects = raycaster.intersectObjects(sphereGroup.children)

    for (const obj of sphereGroup.children) {
        obj.material.color.set('#f00')
    }

    for (const intersect of intersects) {
        intersect.object.material.color.set('#00f')
    }

    if (intersects.length) {
        if (raycasterWitness === null) {
        }
        raycasterWitness = intersects[0]
    } else {
        raycasterWitness = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()