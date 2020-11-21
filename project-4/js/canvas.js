let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let dirLight, scene, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0

const background = '#000000'

// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

// creates the scene object
function createScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(background)

    scene.add(new THREE.AxesHelper(10))
}

// adjusts the camera position when the window is resized
function onResize() {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight

    renderer.setSize(windowWidth, windowHeight)

    if (windowHeight > 0 && windowWidth > 0) {
        camera.aspect = windowWidth / windowHeight
        camera.updateProjectionMatrix()
    }
}

// adjusts the camera position when the window is resized
function onResize() {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight

    renderer.setSize(windowWidth, windowHeight)

    if (windowHeight > 0 && windowWidth > 0) {
        camera.aspect = windowWidth / windowHeight
        camera.updateProjectionMatrix()
    }
}

// animates the scene
function animate() {
    prevFrameTime = nextFrameTime
    nextFrameTime = new Date()

    if (prevFrameTime != 0) {
        deltaFrameTime = (nextFrameTime - prevFrameTime) / 1000
    }

    // keysPressedChecker()
    
    controls.update()
    render()

    requestAnimationFrame(animate)
}

// initial draw of the scene
function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.setSize(windowWidth, windowHeight)
    renderer.shadowMap.enabled = true;
    //renderer.ShadowMap.type = THREE.BasicShadowMap

    document.body.appendChild(renderer.domElement)
    createScene()

    //Cameras
    createPerspectiveCamera()
    createOrthographicCamera(0, 50, 30)
    camera = perspectiveCamera

    //Cameras
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    render()

    window.addEventListener("resize", onResize)
    /*window.addEventListener('keydown', keysPressed)
    window.addEventListener('keyup', keysReleased)*/
}
