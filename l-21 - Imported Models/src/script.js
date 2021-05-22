import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { PointsMaterial } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Load Manager 
const loadManager = new THREE.LoadingManager(
    () => console.log('Finished Loading'),
    (url, loaded, total) => console.log(loaded, " of ", total),
    (error) => console.log("erro", error)
)

/**
 * Models
 */
const group = new THREE.Group()
scene.add(group)

const dracoLoader = new DRACOLoader(loadManager)
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader(loadManager)
gltfLoader.dracoLoader = dracoLoader

let mixer = null

gltfLoader.load(
    'models/Fox/glTF/Fox.glb',
    // 'models/dna/dna.glb',
    (gltf) => {
        scene.add(gltf.scene)
        // const mesh = gltf.scene.children[0].children[0]

        // const pointGeometry = new THREE.BufferGeometry()
        // pointGeometry.setAttribute('position',
        //     new THREE.BufferAttribute(
        //         new Float32Array(mesh.geometry.attributes.position.array),
        //         3)
        // )
        // pointGeometry.center()

        // const pointMesh = new THREE.Points(pointGeometry,
        //     new THREE.PointsMaterial({
        //         color: "#fff",
        //         size: .0125,
        //         sizeAttenuation: true,
        //         // alphaMap: texture,
        //         transparent: true,
        //         // alphaTest: 0.01,
        //         // depthTest: false,
        //         depthWrite: false,
        //         // blending: THREE.AdditiveBlending,
        //         // vertexColors: true, 
        //     })
        // )
        // pointMesh.scale.set(.25, .25, .25)

        // group.add(pointMesh)
        // mixer = new THREE.AnimationMixer(mesh)
        // const action = mixer.clipAction(gltf.animations[2])

        // action.play()
    }
)

group.rotation.y = Math.PI * 0.5
group.rotation.x = Math.PI * 0.55

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(0, 0, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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
 * Helpers
 */

scene.add(new THREE.AxesHelper(2))
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update Mixer
    if (mixer) {
        mixer.update(deltaTime)
    }

    // Group
    group.rotation.z = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()