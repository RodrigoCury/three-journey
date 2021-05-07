import * as THREE from 'three';

////// Canvas
const canvas = document.querySelector("canvas.webgl")

////// Scene
const scene = new THREE.Scene()

////// Red Cube
// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Material
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
})
// Mesh
const mesh = new THREE.Mesh(geometry, material)

// Add to the Scene
scene.add(mesh)

////// Camera
// Window Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Perspective camera 
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 1
// camera.rotation.x = 1

// Add to the scene
scene.add(camera)

////// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})

// Set Sizes
renderer.setSize(sizes.width, sizes.height)

// Render

renderer.render(scene, camera)
