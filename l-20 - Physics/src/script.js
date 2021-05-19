import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

// Object Creators
debugObject.createSphere = () => {
    createSphere(
        Math.random() * .5,
        new THREE.Vector3(
            (Math.random() - .5) * 3,
            (Math.random()) * 3,
            (Math.random() - .5) * 3,
        )
    )
}

debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        new THREE.Vector3(
            (Math.random() - .5) * 3,
            (Math.random()) * 3,
            (Math.random() - .5) * 3,
        )
    )
}

// Object Animators
debugObject.jump = () => {
    objectsToUpdate.forEach(obj => {
        obj.body.applyLocalForce(
            new CANNON.Vec3(0, 150, 0),
            new CANNON.Vec3(0, 0, 0)
        )
    })
}
debugObject.play = () => {
    hitSound.play()
}

// Reset
debugObject.reset = () => {
    objectsToUpdate.forEach(obj => {
        obj.body.removeEventListener('collide', playHitSound)
        world.removeBody(obj.body)

        scene.remove(obj.mesh)
    })
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'jump')
gui.add(debugObject, 'play')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Sound
 */

const hitSound = new Audio('/sounds/hit.wav')

const playHitSound = () => {
    hitSound.currentTime = 0
    hitSound.play()
}

/**
 * Physics
 */


// World
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

// Material
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: .9,
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Sphere 
// const sphereShape = new CANNON.Sphere(.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
// })
// world.addBody(sphereBody)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
})
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * .5
)
world.addBody(floorBody)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereBufferGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Utils
 */
const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
const material = new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
const objectsToUpdate = []
const createSphere = (radius, position) => {

    // THREE JS Mesh
    const mesh = new THREE.Mesh(sphereGeometry, material)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)


    // CANNON Body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: position,
        shape,
        material: defaultMaterial,
    })
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save on Array to Update

    objectsToUpdate.push({
        mesh,
        body,
    })
}

// Box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const createBox = (width, height, depth, position) => {

    // THREE JS Mesh
    const mesh = new THREE.Mesh(boxGeometry, material)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)


    // CANNON Body
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2),)
    const body = new CANNON.Body({
        mass: 1,
        position: position,
        shape,
        material: defaultMaterial,
    })

    world.addBody(body)

    // Save on Array to Update

    objectsToUpdate.push({
        mesh,
        body,
    })
}




/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Apply Forces

    // Update Physics World
    world.step(1 / 60, deltaTime, 3)

    // Update Mesh
    objectsToUpdate.forEach(object => {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    })


    // Update controls
    controls.update()

    // Update Camera

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
