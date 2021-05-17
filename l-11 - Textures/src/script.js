import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AmbientLight, PointLight } from 'three'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
 * Textures
*/

/* Texture Loader and Loading Managers */

const loadingManager = new THREE.LoadingManager()
/* Helps setting  */
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading file: ${url} | Loaded ${itemsLoaded} of ${itemsTotal}`);
}
loadingManager.onLoad = () => console.log('Loading Complete')
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading file: ${url} | Loaded ${itemsLoaded} of ${itemsTotal}`);
}
loadingManager.onError = url => console.error(`Error Loading ${url}`)

const textureLoader = new THREE.TextureLoader(loadingManager)
// const colortexture = textureLoader.load('textures/checkerboard-8x8.png')
const colortexture = textureLoader.load('textures/minecraft.png')

// colortexture.repeat.x = 2
// colortexture.repeat.y = 3
// colortexture.wrapS = THREE.RepeatWrapping
// colortexture.wrapT = THREE.RepeatWrapping

// colortexture.offset.y = .5
// colortexture.offset.x = .5

// colortexture.rotation = Math.PI * .25

// colortexture.center.x = .5
// colortexture.center.y = .5

colortexture.minFilter = THREE.LinearFilter

colortexture.magFilter = THREE.NearestFilter

const nMap = textureLoader.load('textures/door/normal.jpg')
const aoMap = textureLoader.load('textures/door/ambientOcclusion.jpg')
const metalnessMap = textureLoader.load('textures/door/metalness.jpg')
const roughnessMap = textureLoader.load('textures/door/roughness.jpg')
const alphaMap = textureLoader.load('textures/door/alpha.jpg')
const displacementMap = textureLoader.load('textures/door/height.jpg',
    // On success
    () => {
        console.log("IT WOOOORKS, MY MONSTEEER")
    },
    // On Progress
    undefined, // currently not supported three v0.124.0
    // On Error
    error => console.error('Ocorreu um erro ao carregar imagem', error)
)


/** Vanilla Javascript **/

// const image = new Image()
// const colortexture = new THREE.Texture(image)
// image.onload = () => colortexture.needsUpdate = true
// image.src = 'textures/door/color.jpg'


/**
 * Object
 */
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
console.log(geometry.attributes.uv);
const material = new THREE.MeshStandardMaterial({
    map: colortexture,
    normalMap: nMap,
    aoMap: aoMap,
    metalnessMap: metalnessMap,
    roughnessMap: roughnessMap,
    alphaMap: alphaMap,
    displacementMap: displacementMap,

})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

let zPositive = false
let zNegative = false
let xPositive = false
let xNegative = false

document.addEventListener('keydown', event => {
    if (event.key == 'w') {
        zPositive = true;
    } else if (event.key == 's') {
        zNegative = true;
    } else if (event.key == 'a') {
        xPositive = true;
    } else if (event.key == 'd') {
        xNegative = true;
    }
})
document.addEventListener('keyup', event => {
    if (event.key == 'w') {
        zPositive = false;
    } else if (event.key == 's') {
        zNegative = false;
    } else if (event.key == 'a') {
        xPositive = false;
    } else if (event.key == 'd') {
        xNegative = false;
    }
})

document.addEventListener('dblclick', () => mesh.position.set(0, 0, 0))

/*
 *Lights
 */

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(1, 2, 3)
scene.add(pointLight)
const areaLight = new THREE.RectAreaLight(0xffffff, 3, 3, 3)
areaLight.position.set(-1, -2, -3)
areaLight.lookAt(mesh.position)
scene.add(areaLight)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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

    pointLight.position.x = Math.sin(elapsedTime)
    pointLight.position.z = Math.cos(elapsedTime) * 3
    areaLight.position.x = -Math.sin(elapsedTime)
    areaLight.position.z = -Math.cos(elapsedTime) * 3
    areaLight.lookAt(mesh.position)

    if (zPositive) {
        mesh.position.z += .1;
    } if (zNegative) {
        mesh.position.z -= .1;
    } if (xPositive) {
        mesh.position.x += .1
    } if (xNegative) {
        mesh.position.x -= .1;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()