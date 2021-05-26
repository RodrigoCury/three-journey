import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AxesHelper } from 'three'
const GLTFLoader = require('three/examples/jsm/loaders/GLTFLoader').GLTFLoader

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}
const checkMaterial = mesh => mesh instanceof THREE.Mesh && mesh.material instanceof THREE.MeshStandardMaterial

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * Update all Materials
 */
const updateAllMaterials = () => {
    scene.traverse(child => {
        if (checkMaterial(child)) {
            // child.material.envMap = envMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}


/**
 * Loader
 */
const loadManager = new THREE.LoadingManager()
loadManager.onStart = () => console.log('Started Loading');
loadManager.onProgress = (url, loaded, total) => console.log(
    `Loaded ${url.split('/').reduce((a, b) => b)}`)
loadManager.onLoad = () => console.log("Finished Loading")
loadManager.onError = url => console.warn(url + "Error Loading")

const textureLoader = new THREE.TextureLoader(loadManager)
const gltfLoader = new GLTFLoader(loadManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadManager)

/**
 * Textures
 */
const envMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])
envMap.encoding = THREE.sRGBEncoding

debugObject.envMapIntensity = 4
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(.001).onChange(updateAllMaterials)

/**
 * Enviroment
 */
scene.background = envMap
scene.environment = envMap

/**
 * Model
 */
gltfLoader.load(
    'models/FlightHelmet/glTF/FlightHelmet.gltf',
    gltf => {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = Math.PI * .5
        scene.add(gltf.scene)

        const helmetFolder = gui.addFolder("Helmet")
        helmetFolder
            .add(gltf.scene.rotation, 'y')
            .min(0)
            .max(Math.PI * 2)
            .step(.01)

        updateAllMaterials()
    }
)


/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: .7,
        roughness: .7
    })
)
testSphere.position.y = 1.25
scene.add(testSphere)

/**
 * Lights
 */
const directionalFolder = gui.addFolder("Directional Light")

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(.25, 5, -5)
directionalLight.castShadow = true
directionalLight.target.position.set(0, 0, 0)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(directionalLight)

directionalFolder.add(directionalLight, 'intensity').min(0).max(10).step(.001)
directionalFolder.add(directionalLight.position, 'x').min(-5).max(5).step(.01)
directionalFolder.add(directionalLight.position, 'y').min(-5).max(5).step(.01)
directionalFolder.add(directionalLight.position, 'z').min(-5).max(5).step(.01)

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
camera.position.set(4, 1, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.shadowMap.enable = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const rendererFolder = gui.addFolder("Renderer")
rendererFolder.add(renderer, 'toneMapping', {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACES: THREE.ACESFilmicToneMapping,
}).onFinishChange(updateAllMaterials)

rendererFolder.add(renderer, 'toneMappingExposure').min(0).max(10).step(.001).name("Exposure")

/**
 * Helpers
 */
scene.add(new THREE.AxesHelper(1.5))

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()