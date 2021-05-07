import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
const filename = (str) => {
    let lista = str.split('/')
    return lista[lista.length - 1]
}
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xfccfbf)


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
const matcapTexture = textureLoader.load('textures/matcaps/5.png')
const donutTexture = textureLoader.load('textures/donut.jpeg')

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader(loadManager)
const font = fontLoader.load('fonts/fonts.json',
    font => {
        const bevelSize = 0.02
        const bevelThickness = 0.3

        const textGeometry = new THREE.TextBufferGeometry(
            'LUIGI VAI SE FUDER',
            {
                font: font,
                size: .5,
                height: .2,
                curveSegments: 7,
                bevelEnabled: true,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )

        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = matcapTexture
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(
            textGeometry, textMaterial
        )
        text.scale.set(1, 1, .1)
        scene.add(text)

        console.time('donuts')

        const donutGeometry = new THREE.TorusBufferGeometry(.3, .2, 20, 45)
        const donutMaterial = new THREE.MeshBasicMaterial({
            map: donutTexture
        })
        for (let i = 200; i > 0; i--) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            donut.position.set(
                (Math.random() - .5) * 15,
                (Math.random() - .6) * 15,
                (Math.random() - .6) * 15,
            )
            donut.rotation.set(
                (Math.random() - .5) * 50,
                (Math.random() - .5) * 50,
                (Math.random() - .5) * 50,
            )
            const scale = Math.random()
            donut.scale.set(
                scale,
                scale,
                scale,
            )
            scene.add(donut)
        }
        console.timeEnd('donuts')
    }
)
// const font = fontLoader.load('fonts/fonts.json',
//     font => {
//         const bevelSize = 0.02
//         const bevelThickness = 0.3

//         const textGeometry = new THREE.TextBufferGeometry(
//             'Hello 3Js',
//             {
//                 font: font,
//                 size: .5,
//                 height: .2,
//                 curveSegments: 7,
//                 bevelEnabled: true,
//                 bevelThickness: bevelThickness,
//                 bevelSize: bevelSize,
//                 bevelOffset: 0,
//                 bevelSegments: 5
//             }
//         )

//         textGeometry.computeBoundingBox()
//         textGeometry.translate(
//             -(textGeometry.boundingBox.max.x - bevelSize) * .5,
//             -(textGeometry.boundingBox.max.y - bevelSize) * .5,
//             -(textGeometry.boundingBox.max.z - bevelThickness) * .5,
//         )

//         const textMaterial = new THREE.MeshStandardMaterial({
//         })
//         // textMaterial.wireframe = true
//         const text = new THREE.Mesh(
//             textGeometry, textMaterial
//         )
//         text.scale.set(1, 1, .1)
//         scene.add(text)
//     }
// )

const light = new THREE.AmbientLight(0xffffff, .3)
const light2 = new THREE.PointLight(0xffffff, 1)
light2.position.y = 2
light2.position.z = 2
scene.add(light, light2)
/**
 * Object
 */


// scene.add(cube)

const axes = new THREE.AxesHelper()
scene.add(axes)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()