import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Helpers
 */

const filename = (str) => {
    let lista = str.split('/')
    return lista[lista.length - 1]
}

const degrees120 = Math.PI * 2 / 3


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Debugger
const gui = new dat.GUI()

/**
 * Textures
 */

const loadManager = new THREE.LoadingManager(
    () => console.log('Loading Complete'),
    (url, itemsLoaded, itemsTotal) => {
        console.log(`Started loading file: ${filename(url)} | Loaded ${itemsLoaded} of ${itemsTotal}`);
    },
    url => console.error(`Error Loading ${filename(url)}`),
)
const textureLoader = new THREE.TextureLoader(loadManager)
const doorAplhaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const dooRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')

const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const matcapTexture = textureLoader.load('textures/matcaps/3.png')

//// TextureMaps
// CubeTextureLoader

const cubeTextureLoader = new THREE.CubeTextureLoader(loadManager)
const environmentMapTexture = cubeTextureLoader.load([
    'textures/environmentMaps/3/px.jpg',
    'textures/environmentMaps/3/nx.jpg',
    'textures/environmentMaps/3/py.jpg',
    'textures/environmentMaps/3/ny.jpg',
    'textures/environmentMaps/3/pz.jpg',
    'textures/environmentMaps/3/nz.jpg',

])

const moonColorTexture = textureLoader.load("textures/moon/earthTextureMap.jpg")
/*
* Objects
*/

//// Mesh Basic Material
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color.set(0x00ff00)
// material.wireframe = true
// material.opacity = .5
// material.transparent = true
// material.alphaMap = doorAplhaTexture
// material.side = THREE.FrontSide
// material.side = THREE.BackSide
// material.side = THREE.DoubleSide

//// Mesh Normal Material
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true
// material.wireframe = true
// material.opacity = .5
// material.transparent = true
// material.side = THREE.FrontSide
// material.side = THREE.BackSide
// material.side = THREE.DoubleSide


//// Mesh Matcap Material
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

//// Mesh Depth Material
// const material = new THREE.MeshDepthMaterial()

/**
 * Materials that React to Light
 */

//// Mesh Lambert Material
// const material = new THREE.MeshLambertMaterial()

//// Mesh Phong Material
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x00f0ff)

//// Mesh Toon Material
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// const sphereMaterial = new THREE.MeshToonMaterial()
// sphereMaterial.map = moonColorTexture
// sphereMaterial.displacementMap = moonColorTexture

//// Mesh Standard Material
// const material = new THREE.MeshStandardMaterial()
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// // alpha needs
// material.alphaMap = doorAplhaTexture
// material.transparent = true

// material.displacementMap = doorHeightTexture
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = dooRoughnessTexture
// material.normalMap = doorNormalTexture
// material.displacementScale = .15
// gui.add(material, 'aoMapIntensity').min(0).max(1).step(.01)
// gui.add(material.normalScale, 'x').min(0).max(1).step(.01).name("NormalScale X")
// gui.add(material.normalScale, 'y').min(0).max(1).step(.01).name("NormalScale Y")
// material.wireframe = true

// // Mesh Physical Material
const material = new THREE.MeshPhysicalMaterial()
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
// alpha needs
material.alphaMap = doorAplhaTexture
material.transparent = true

material.metalnessMap = doorMetalnessTexture
material.roughnessMap = dooRoughnessTexture
material.normalMap = doorNormalTexture
material.displacementMap = doorHeightTexture
material.displacementScale = .15
gui.add(material, 'aoMapIntensity').min(0).max(1).step(.01)
gui.add(material, 'metalness').min(0).max(1).step(.01)
gui.add(material, 'displacementScale').min(0).max(1).step(.01)
gui.add(material.normalScale, 'x').min(0).max(1).step(.01).name("NormalScale X")
gui.add(material.normalScale, 'y').min(0).max(1).step(.01).name("NormalScale Y")
// material.wireframe = true
material.envMap = environmentMapTexture


/**
 * Enviroment Map
 */

// material to show its capacities
// const material = new THREE.MeshStandardMaterial()
// material.envMap = environmentMapTexture
// material.metalness = .7
// material.roughness = .2
// material.normalMap = doorNormalTexture
// material.displacementScale = .15
// material.displacementMap = doorHeightTexture
// gui.add(material, 'aoMapIntensity').min(0).max(1).step(.01)
// gui.add(material, 'displacementScale').min(0).max(1).step(.01)
// gui.add(material.normalScale, 'x').min(0).max(1).step(.01).name("NormalScale X")
// gui.add(material.normalScale, 'y').min(0).max(1).step(.01).name("NormalScale Y")


const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.25, 128, 128),
    material
)
sphere.position.z = Math.sin(0)
sphere.position.x = Math.cos(0)
// add attribure for Ambient Occlusion
sphere.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(.5, .5, .5, 100, 100, 100),
    material,
)
box.position.z = Math.sin(degrees120)
box.position.x = Math.cos(degrees120)
// add attribure for Ambient Occlusion
box.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(box.geometry.attributes.uv.array, 2)
)


const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(.2, .05, 64, 128),
    material
)
torus.position.z = Math.sin(degrees120 * 2)
torus.position.x = Math.cos(degrees120 * 2)
// add attribure for Ambient Occlusion
torus.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

// Plane
const planeMaterial = new THREE.MeshBasicMaterial()
planeMaterial.map = environmentMapTexture
planeMaterial.side = THREE.DoubleSide

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5, 100, 100),
    material,
)
// add attribure for Ambient Occlusion
plane.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)
plane.rotation.x = Math.PI * 1.5

scene.add(plane)

const axes = new THREE.AxesHelper(3)
scene.add(axes)

console.log(box.position.distanceTo(sphere.position),
    box.position.distanceTo(torus.position),
    sphere.position.distanceTo(torus.position),
)

/**
 * Lights
 */


const ambientLight = new THREE.AmbientLight(0xffffff, .25);
const pointLight = new THREE.PointLight(0xffffff, .5);
pointLight.position.y = 1.
scene.add(ambientLight, pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight, .125)
scene.add(pointLightHelper)

/**
 * Groups
 */
const group = new THREE.Group()
group.position.y = .3
scene.add(group)
group.add(sphere, torus, box)

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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    sphere.rotation.y = .1 * elapsedTime
    box.rotation.y = .1 * elapsedTime
    torus.rotation.y = -.1 * elapsedTime

    // update Lights

    pointLight.position.x = Math.sin(.5 * elapsedTime) * 2;
    pointLight.position.z = Math.cos(.5 * elapsedTime) * 2;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()