import './style.css'
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

const degressRotation = (degrees) => {
    let normalized = degrees % 360;
    let percentile = normalized / 360
    console.log(percentile)
    return Math.PI * percentile
}

////// Canvas
const canvas = document.querySelector("canvas.webgl")

////// Scene
const scene = new THREE.Scene()



/* Group Objects */
const group = new THREE.Group()
scene.add(group)

// Group Manipulation
group.rotation.y = 1
group.scale.y = 2
group.position.y = 1

/* Red Cube */
// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Material
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
})
// Mesh
const mesh = new THREE.Mesh(geometry, material)

// Position

mesh.position.set(-1.5, 0, 0)

// Scale

// Rotation
// mesh.rotation.y = degressRotation(90)
// mesh.rotation.x = degressRotation(45)

// Quartenion
// mesh.quaternion.set(0, 1, 0, 0)

// Add to the Scene
group.add(mesh)

/* Blue Cube */
const blueCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
group.add(blueCube)

/* Green Cube */
const greenCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
group.add(greenCube)
greenCube.position.set(1.5, 0, 0)

////// Axes Helper

const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

////// Camera
// Window Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Perspective camera 
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height)
camera.position.set(0, 0, 2)

// Look At
camera.lookAt(group.position)

// Add to the scene
scene.add(camera)


////// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

// Set Sizes
renderer.setSize(sizes.width, sizes.height)

// Render

renderer.render(scene, camera)
