import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import * as dat from 'dat.gui'

const tintVertexShader = require("./shaders/tint/vertex.vert").default
const tintFragmentShader = require("./shaders/tint/fragment.frag").default
const waveVertexShader = require('./shaders/waves/vertex.vert').default
const waveFragmentShader = require('./shaders/waves/fragment.frag').default
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
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()
/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
            child.material.side = 2
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Texture
 */

const normalMap = textureLoader.load('/textures/interfaceNormalMap.png')
/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

const lights = gui.addFolder('Lights')
lights.add(directionalLight.position, 'x', -3, 3, 0.001)
lights.add(directionalLight.position, 'y', -3, 3, 0.001)
lights.add(directionalLight.position, 'z', -3, 3, 0.001)
lights.close()

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
    textureLoader.load('textures/interfaceNormalMap.png')
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.setSize(sizes.width, sizes.height)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Render target
 */
const isWebGL2 = renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2
const isNotWebGL2 = renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2
let renderTargetClass = isWebGL2 ? THREE.WebGLMultisampleRenderTarget : THREE.WebGLRenderTarget

const renderTarget = new renderTargetClass(100, 100, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    encoding: THREE.sRGBEncoding,
})

/**
 * Post Processing
 */
const composer = new EffectComposer(renderer, renderTarget)
composer.setSize(sizes.width, sizes.height)
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
composer.addPass(dotScreenPass)

const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = .5
unrealBloomPass.radius = .5
unrealBloomPass.threshold = .6
unrealBloomPass.enabled = false
composer.addPass(unrealBloomPass)

const glitchPass = new GlitchPass()
glitchPass.goWild = false
glitchPass.enabled = false
composer.addPass(glitchPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
composer.addPass(rgbShiftPass)

// Custom Tint Shader
const TintShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTint: { value: new THREE.Vector3(3, 1, 2) },
    },
    vertexShader: tintVertexShader,
    fragmentShader: tintFragmentShader,
}

const tintShader = new ShaderPass(TintShader)
tintShader.enabled = false
composer.addPass(tintShader)

// Custom Waves Shader
const WaveShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0.0 },
    },
    vertexShader: waveVertexShader,
    fragmentShader: waveFragmentShader,
}

const waveShader = new ShaderPass(WaveShader)
waveShader.enabled = false
composer.addPass(waveShader)



const renderPasses = gui.addFolder("Passes")
renderPasses.add(dotScreenPass, 'enabled').name("DotPasss")
renderPasses.add(glitchPass, 'enabled').name("glitchPass")
renderPasses.add(glitchPass, 'goWild').name("glitchPass WILD")
renderPasses.add(rgbShiftPass, 'enabled').name("rgbShiftShader")
renderPasses.add(tintShader, 'enabled').name("TINT")
renderPasses.add(tintShader.material.uniforms.uTint.value, 'x', -0, 4, 0.001).name('r')
renderPasses.add(tintShader.material.uniforms.uTint.value, 'y', -0, 4, 0.001).name('g')
renderPasses.add(tintShader.material.uniforms.uTint.value, 'z', -0, 4, 0.001).name('b')
renderPasses.add(waveShader, 'enabled').name("TINT")
renderPasses.add(unrealBloomPass, 'enabled').name("Unreal Bloom")
renderPasses.add(unrealBloomPass, 'strength', 0, 5, 0.01)
renderPasses.add(unrealBloomPass, 'radius', 0, 5, 0.01)
renderPasses.add(unrealBloomPass, 'threshold', 0, 0.8, 0.001)
renderPasses.close()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Wave ShaderPass
    waveShader.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    composer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()