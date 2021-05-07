import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/*
 * Cursor
 */

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
let mouseCoordinates = {
    x: undefined,
    y: undefined,
}

window.addEventListener('mousemove', (event) => {
    mouseCoordinates.x = (event.clientX / sizes.width - .5) * 2
    mouseCoordinates.y = (event.clientY / sizes.height - .5) * 2
})
/*
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        wireframeLinecap: 'butt',
        wireframeLinejoin: 'bevel'
    })
)
mesh.position.y = 3
scene.add(mesh)

// Camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 20)
camera.position.z = Math.cos(0) * 3
camera.position.x = Math.sin(0) * 3
camera.lookAt(mesh.position)
scene.add(camera)


const axes = new THREE.AxesHelper(3)
scene.add(axes)
const axes2 = new THREE.AxesHelper(1)
axes2.position.y = 2
scene.add(axes2)


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const controls = new OrbitControls(camera, document.body);
controls.target.y = mesh.position.y
controls.update()



const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    //  Update Camera
    // camera.rotation.y = mouseCoordinates.x;
    // camera.rotation.x = mouseCoordinates.y;

    // camera.position.z = Math.sin(mouseCoordinates.x * Math.PI) * 3
    // camera.position.x = Math.cos(mouseCoordinates.x * Math.PI) * 3
    // camera.position.y = Math.tan(mouseCoordinates.y * Math.PI / 1.999999)
    // console.log(mouseCoordinates.y);
    // camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

window.addEventListener('resize', event => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)
})

tick()