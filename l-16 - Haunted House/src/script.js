import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Group, WebGLGeometries } from 'three'

/**
 * Helpers
 */

const getFileName = (str) => str.split('/').reduce((a, b) => b, '')

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.close()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Fog 

const fog = new THREE.Fog(0xffffff, 1, 15)
scene.fog = fog

/**
 * Textures
 */
console.time("Textures")
const loadManager = new THREE.LoadingManager(
    () => console.timeEnd("Textures"),
    (url, loaded, total) => {
        console.log(`Carregando "${getFileName(url)}" | ${loaded} de ${total}`)
    },
    (url) => console.error(`Erro ao carregar ${getFileName(url)}`)
)
const textureLoader = new THREE.TextureLoader(loadManager)

//Bricks Textures
const bricksAO = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const bricksColor = textureLoader.load('textures/bricks/color.jpg')
const bricksNormal = textureLoader.load('textures/bricks/normal.jpg')
const bricksRoughness = textureLoader.load('textures/bricks/roughness.jpg')

// Door Textures
const doorAlpha = textureLoader.load('textures/door/alpha.jpg')
const doorAO = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorColor = textureLoader.load('textures/door/color.jpg')
const doorHeightMap = textureLoader.load('textures/door/height.jpg')
const doorMetalness = textureLoader.load('textures/door/metalness.jpg')
const doorNormal = textureLoader.load('textures/door/normal.jpg')
const doorRoughness = textureLoader.load('textures/door/roughness.jpg')

// Grass Textures

const grassAO = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassColor = textureLoader.load('textures/grass/color.jpg')
const grassNormal = textureLoader.load('textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('textures/grass/roughness.jpg')


// Ghost Texture 
const ghostColor = textureLoader.load('textures/simpleShadow.jpg')
/**
 * House
 */

const house = new THREE.Group()
scene.add(house)

const wallHeight = 2.5
const wallWidth = 5
const roofHeight = 1
const roofRadius = (Math.sqrt(2) * wallWidth / 2) + .5
const doorHeight = 1.9

const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(wallWidth, 2.5, wallWidth),
    new THREE.MeshStandardMaterial({
        aoMap: bricksAO,
        map: bricksColor,
        normalMap: bricksNormal,
        roughnessMap: bricksRoughness,
    })
)
walls.position.y = 2.5 / 2



const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(roofRadius, roofHeight, 4, 1, false),
    new THREE.MeshStandardMaterial({
        color: "#b35f45"
    })
)
roof.position.y = wallHeight + (roofHeight / 2)
roof.rotation.y = Math.PI / 4


const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(.75, doorHeight),
    new THREE.MeshStandardMaterial({
        alphaMap: doorAlpha,
        aoMap: doorAO,
        map: doorColor,
        heightMap: doorHeightMap,
        metalnessMap: doorMetalness,
        normalMap: doorNormal,
        roughnessMap: doorRoughness,
    })
)

door.position.y = doorHeight / 2
door.position.z = wallWidth / 2 + .01

house.add(walls, roof, door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: "#89C854"
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(.5, .5, .5)
bush1.position.set(.8, .2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(.25, .25, .25)
bush2.position.set(1.4, .1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(.4, .4, .4)
bush3.position.set(-.8, .1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(.15, .15, .15)
bush4.position.set(-1, .05, 2.6,)

house.add(bush1, bush2, bush3, bush4)

// Floor
const floorSide = 20
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(floorSide, floorSide),
    new THREE.MeshStandardMaterial({
        map: grassColor,
        aoMap: grassAO,
        normalMap: grassNormal,
        roughnessMap: grassRoughness
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// Graves

const graves = new THREE.Group()
scene.add(graves)

const graveGeometries = new THREE.BoxBufferGeometry(.1, .6, .1)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

const gravePlacementMax = (floorSide / 2 - 1)
const gravePlacementMin = (roofRadius + 1)
const gravePlacementThreshold = (gravePlacementMax - gravePlacementMin) / 2
const rndThreshold = () => ((Math.random() - .5) * 2) * gravePlacementThreshold

for (let i = 50; i > 0; i--) {
    let graveGroup = new THREE.Group()
    let grave = new THREE.Mesh(graveGeometries, graveMaterial)
    let grave2 = new THREE.Mesh(graveGeometries, graveMaterial)
    grave2.rotation.z = Math.PI * .5
    grave2.position.y = .2
    grave2.scale.set(.7, .8, .7)
    graveGroup.add(grave, grave2)
    let angle = Math.random() * Math.PI * 2
    let X = Math.cos(angle) * (gravePlacementMin + gravePlacementThreshold) + rndThreshold()
    let Z = Math.sin(angle) * (gravePlacementMin + gravePlacementThreshold) + rndThreshold()
    graveGroup.position.set(X, .3, Z)
    graves.add(graveGroup)
}

// Ghosts 

const ghostGeometry1 = new THREE.SphereBufferGeometry(.25, 16, 16)
const ghostMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: .35,
    matcap: ghostColor
})

const ghost1 = new THREE.Group()

const head = new THREE.Mesh(ghostGeometry1, ghostMaterial)
head.position.set(0, .25, 0)
head.scale.set(1, 2.5, 1)

const ectoplasm = new THREE.PointLight(0xcfcfcf, 0.1)
ectoplasm.position.set(0, .75, 0)

ghost1.add(head, ectoplasm)
ghost1.position.set(7, 0, 7)
scene.add(ghost1)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name("AmbIntensity")
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name("MoonIntensity")
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight(0xff7d46, 1, 5)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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

    // Update Ghost
    ghost1.position.x = Math.cos(elapsedTime / 5) * (gravePlacementMin + gravePlacementThreshold)
    ghost1.position.z = Math.sin(elapsedTime / 5) * (gravePlacementMin + gravePlacementThreshold)
    ghost1.position.y = Math.cos(elapsedTime / 2) * .25

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()