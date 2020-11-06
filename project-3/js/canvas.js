let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, camera, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0
let controls

const background = '#bababa'

const palanqueProperties = {
    radius: 35,
    height: 1.2,
    color: '#bf6427'
}

function createPalanque(x, y, z) {
    palanque = new THREE.Object3D()
    geometry = new THREE.CylinderGeometry( palanqueProperties.radius, palanqueProperties.radius, palanqueProperties.height, 32);
    
    material = new THREE.MeshBasicMaterial({ color: palanqueProperties.color, wireframe: false })

    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    palanque.add(mesh)
    scene.add(palanque)

    //Criar o CYBERTRUCK

}

// updates the position of the orthogonal camera
function updateCameraPosition(obj, x, y, z, lookAt) {
    obj.position.x = x
    obj.position.y = y
    obj.position.z = z
    obj.lookAt(lookAt)
}

function createPerspectiveCamera() {
    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, palanqueProperties.height*1000)

    updateCameraPosition(camera, palanqueProperties.radius*2, palanqueProperties.radius, palanqueProperties.radius, scene.position)
}

// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

// creates the scene object
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    scene.add(new THREE.AxesHelper(1000))

    createPalanque(0, palanqueProperties.height/2, 0)

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
    
    controls.update()
    render()

    requestAnimationFrame(animate)
}

// initial draw of the scene
function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.setSize(windowWidth, windowHeight)

    document.body.appendChild(renderer.domElement)
    
    createScene()
    createPerspectiveCamera()

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    render()

    window.addEventListener("resize", onResize)

}