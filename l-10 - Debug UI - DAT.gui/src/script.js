import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as DAT from 'dat.gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
 * Debug
 */

const dat = new DAT.GUI()

/**
 * Object
 */
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const mesh1 = dat.addFolder('mesh1')



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
camera.position.y = 2
camera.position.z = 3
scene.add(camera)


mesh1
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(-.01)
    .name("Y Axis")

mesh1
    .add(material, 'visible')

mesh1
    .add(material, 'wireframe')

const params = {
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, {
            duration: 1,
            delay: 0.5,
            repeat: 2,
            y: mesh.rotation.y + 10
        })
        gsap.to(mesh.position, {
            duration: 1,
            delay: 0.5,
            repeat: 2,
            y: 1,
            onRepeat: () => gsap.to(mesh.position, {
                duration: .5,
                delay: 0,
                y: 0
            })
        })
    }
}

mesh1
    .add(params, 'spin')

mesh1
    .addColor(params, 'color')
    .onChange(() => material.color.set(params.color))

console.log(mesh1)


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

    // camera.position.x = Math.sin(elapsedTime) * 3
    // camera.position.z = Math.cos(elapsedTime) * 3
    // camera.lookAt(mesh.position)
    // // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()