import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { BufferAttribute, BufferGeometry } from 'three'


const perlin = require('perlin-noise')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// const geometry = new THREE.Geometry()
// for (let i = 0; i < 10; i++) {
//     if (i == 0) {
//         for (let j = 0; j < 3; j++) {
//             let p1 = (Math.random() - .5) * 2
//             let p2 = (Math.random() - .5) * 2
//             let p3 = (Math.random() - .5) * 2
//             geometry.vertices.push(new THREE.Vector3(
//                 p1, p2, p3
//             ))
//         }
//         geometry.faces.push(new THREE.Face3(
//             i,
//             i + 1,
//             i + 2,
//         ))
//     } else {
//         geometry.vertices.push(new THREE.Vector3(
//             (Math.random() - .5) * 2,
//             (Math.random() - .5) * 2,
//             (Math.random() - .5) * 2,
//         ))
//         geometry.faces.push(new THREE.Face3(
//             i,
//             i + 1,
//             i + 2,
//         ))
//     }
// }

const count = 10
let size = 4
let grow = true
let positionsArr = new Float32Array(count * 9)
positionsArr.forEach((n, i, a) => {
    // a[i] = (Math.random() - .5) * size
    if (Math.random() >= .5) {
        a[i] = .5
    } else {
        a[i] = -.5
    }
})


const positionsAttr = new BufferAttribute(positionsArr, 3)

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionsAttr)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
// mesh.position.y = 1
scene.add(mesh)
// const geometry2 = new THREE.PlaneBufferGeometry(10, 10, 32)
// const material2 = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false })
// const mesh2 = new THREE.Mesh(geometry2, material2)
// mesh2.rotation.x = Math.PI * 1.5
// scene.add(mesh2)


scene.add(new THREE.AxesHelper())

// const ambient = new THREE.AmbientLight({
//     color: 0xffffff,
//     intensity: .001
// })
// scene.add(ambient)

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
camera.position.x = 3
camera.position.y = 5
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new TrackballControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

console.log(positionsArr)
console.log(perlin.generatePerlinNoise(1, 1));

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    let Arr = []

    positionsArr.forEach((x, i, a) => {
        let noise = perlin.generatePerlinNoise(1, 1)
        if (Math.random() > 0.5) {
            Arr.push(x + noise[0] / 10)
        } else {
            Arr.push(x - noise[0] / 10)
        }
    })

    let newArr = new Float32Array(Arr)

    geometry.setAttribute('position', new THREE.BufferAttribute(newArr, 3))

    positionsArr = newArr

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()