let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0

const background = '#000000'

const palanqueProperties = {
    radius: 25,
    height: 1.2,
    color: '#4c280f',
    rotationFactor: 100
}

const floorProperties = {
    width: palanqueProperties.radius * 4,
    depth: palanqueProperties.radius * 4,
    height: palanqueProperties.height * 0.8,
    color: '#7b836a'
}

//TESTING CUBE
const cubeProperties = {
    width: palanqueProperties.radius * 0.6,
    depth: palanqueProperties.radius * 0.6,
    height: palanqueProperties.radius * 0.6,
    color: '#024059'
}

const directionalLightProperties = {
    intensity: 1,
    color: '#ffffff'
}

function createCube(obj, x, y, z) {
    cube = new THREE.Object3D()
    geometry = new THREE.BoxGeometry(cubeProperties.width, cubeProperties.height, cubeProperties.depth);

    material = new THREE.MeshPhongMaterial({ color: cubeProperties.color })

    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.rotation.x = Math.PI/4
    mesh.rotation.y = Math.PI/4
    mesh.position.set(x, y, z)

    cube.add(mesh)

    obj.add(cube)
}

function createFloor(x, y, z) {
    floor = new THREE.Object3D()
    geometry = new THREE.BoxGeometry(floorProperties.width, floorProperties.height, floorProperties.depth);

    material = new THREE.MeshPhongMaterial({ color: floorProperties.color })

    mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true;

    mesh.position.set(x, y, z)

    floor.add(mesh)
    scene.add(floor)
}

function createPalanque(x, y, z) {
    palanque = new THREE.Object3D()
    geometry = new THREE.CylinderGeometry( palanqueProperties.radius, palanqueProperties.radius, palanqueProperties.height, 32);
    
    material = new THREE.MeshPhongMaterial({ color: palanqueProperties.color})

    mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true;

    mesh.position.set(x, y, z)

    palanque.add(mesh)
    scene.add(palanque)

    //Criar o CYBERTRUCK
    createCube(palanque, 0, cubeProperties.height, 0)

}

function rotatePalanque(degrees) {
    palanque.rotation.y += degrees
}

function createDirectionalLight(x, y, z) {
    dirLight = new THREE.DirectionalLight(directionalLightProperties.color, directionalLightProperties.intensity);
    dirLight.castShadow = true;
    dirLight.position.set(x, y, z);
    dirLight.target.position.set(0, 0, 0);
    scene.add(dirLight);
    scene.add(dirLight.target);
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
    createFloor(0, -floorProperties.height/2, 0)

    //criar holofotes
    holofote1 = createHolofote(-holofoteProperties.x, holofoteProperties.y, holofoteProperties.z)
    holofote2 = createHolofote(holofoteProperties.x, holofoteProperties.y, 0)
    holofote3 = createHolofote(holofoteProperties.x*0.3, holofoteProperties.y*1.3, -holofoteProperties.z)

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

    keysPressedChecker()
    
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
    createDirectionalLight(palanqueProperties.radius,palanqueProperties.radius, palanqueProperties.radius)
    createPerspectiveCamera()
    createOrthographicCamera(floorProperties.width, 0, 0)
    camera = perspectiveCamera



    controls = new THREE.OrbitControls(camera, renderer.domElement)
    render()

    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', keysPressed)
    window.addEventListener('keyup', keysReleased)
}
