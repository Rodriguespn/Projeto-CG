let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, camera, renderer, geometry, material, mesh, ball

// inital coordinates of the camera
const initCameraPosition = {
    cameraX: 15, 
    cameraY: 10, 
    cameraZ: 30
}

// the default color of the diferente objects
const objectsColors = {
    wire: '#5e5e5e',
    cube: '#D8122F',
    circle: '#44EDED',
    ellipse: '#0CEE6C'
}

// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

// creates a cube at the (x,y,z) position
function createCube(obj, x, y, z) {
    geometry = new THREE.CubeGeometry(2, 0.1, 1)
    material = new THREE.MeshBasicMaterial({ color: objectsColors.cube, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    obj.add(mesh)
}

// creates a ellipse at the (x,y,z) position
function createEllipse(obj, x, y, z) {
    const path = new THREE.Shape();
    path.absellipse(0,0,0.5,1,0, Math.PI*2, false,0);
    geometry = new THREE.ShapeBufferGeometry(path);

    material = new THREE.MeshBasicMaterial({ color: objectsColors.ellipse, side: THREE.DoubleSide, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.rotation.x = Math.PI/2
    mesh.rotation.z = Math.PI/2
    mesh.position.set(x, y, z)

    obj.add(mesh)
    
}

// creates a circle at the (x,y,z) position
function createCircle(obj, x, y, z) {
    geometry = new THREE.CylinderGeometry(1, 1, 0.1);

    material = new THREE.MeshBasicMaterial({ color: objectsColors.circle, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    obj.add(mesh)
}

// creates a vertical cable at the (x,y,z) position
function createVerticalWire(obj, heigth, x, y, z) {
    geometry = new THREE.CylinderGeometry(0.05, 0.05, heigth, 8)

    material = new THREE.MeshBasicMaterial({ color: objectsColors.wire, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    obj.add(mesh)
}

// creates a horizontal cable at the (x,y,z) position
function createHorizontalWire(obj, height, x, y, z) {
    userData = { rotation: false, speed: 0 }
    
    geometry = new THREE.CylinderGeometry(0.05, 0.05, height, 8)
    material = new THREE.MeshBasicMaterial({ color: objectsColors.wire, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.rotation.z = Math.PI / 2
    mesh.position.set(x, y, z)

    obj.add(mesh)
}

function createFirstMobileSegment(mobile) {
    segment = new THREE.Object3D()

    createHorizontalWire(segment, 10, 0, 0, 0)
    createCube(segment, -6, 0, 0)
    createEllipse(segment, 6, 0, 0)

    segment.name = "segment"

    mobile.add(segment)
}

function createSecondMobileSegment(mobile) {
    segment = new THREE.Object3D()

    createHorizontalWire(segment, 10, 3, -2, 0)
    createCube(segment, 9, -2, 0)
    createCircle(segment, -3, -2, 0)

    segment.name = "segment"

    mobile.add(segment)
}

function createThirdMobileSegment(mobile) {
    segment = new THREE.Object3D()

    createHorizontalWire(segment, 10, 6, -4, 0)
    createCircle(segment, 0, -4, 0)
    createEllipse(segment, 12, -4, 0)

    segment.name = "segment"

    mobile.add(segment)
}

function createFourthMobileSegment(mobile) {
    segment = new THREE.Object3D()

    createHorizontalWire(segment, 10, 9, -6, 0)
    createCube(segment, 3, -6, 0)
    createCircle(segment, 15, -6, 0)

    segment.name = "segment"

    mobile.add(segment)
}

function createFifthMobileSegment(mobile) {
    segment = new THREE.Object3D()
 
    createHorizontalWire(segment, 10, 12, -8, 0)
    createCube(segment, 6, -8, 0)
    createCube(segment, 18, -8, 0)

    segment.name = "segment"

    mobile.add(segment)
}

// creates the mobile
function createMobile(x, y, z) {
    const mobile = new THREE.Object3D()

    // Vertical wires
    createVerticalWire(mobile, 4, 0, 2, 0)
    createVerticalWire(mobile, 2, 3, -1, 0)
    createVerticalWire(mobile, 2, 6, -3, 0)
    createVerticalWire(mobile, 2, 9, -5, 0)
    createVerticalWire(mobile, 2, 12, -7, 0)

    createFirstMobileSegment(mobile)
    createSecondMobileSegment(mobile)
    createThirdMobileSegment(mobile)
    createFourthMobileSegment(mobile)
    createFifthMobileSegment(mobile)

    scene.add(mobile)

    mobile.position.x = x
    mobile.position.y = y
    mobile.position.z = z

    console.log(mobile)
}

// updates the position of the orthogonal camera
function updateCameraPosition(x, y, z) {
    camera.position.x = x
    camera.position.y = y
    camera.position.z = z
    camera.lookAt(scene.position)
}

// creates the camera object
function createCamera() {
    camera = new THREE.PerspectiveCamera(70, windowWidth / windowHeight, 1, 1000)

    updateCameraPosition(initCameraPosition.cameraX, initCameraPosition.cameraY, initCameraPosition.cameraZ)
}

// creates the scene object
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#d0e7e5');

    scene.add(new THREE.AxesHelper(10))

    createMobile(0,0,0)
}

// adjusts the camera position when the window is resized
function onResize() {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight

    renderer.setSize(windowWidth, windowHeight)

    if (windowHeight > 0 && windowWidth > 0) {
        camera.aspect = renderer.getSize().width / renderer.getSize().height
        camera.updateProjectionMatrix()
    }
}

// handles an event when a key is pressed
function onKeyDown(event) {
    console.log('key pressed: ' + event.key)
    switch (event.key) {
        case '1':
            updateCameraPosition(initCameraPosition.cameraX, initCameraPosition.cameraY, initCameraPosition.cameraZ)
            break;

        case '2':
            updateCameraPosition(0, 30, 0)
            break;

        case '3':
            updateCameraPosition(0, 0, 30)
            break;

        case '4':
            scene.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe
                }
            })
            break;

        default:
            break;
    }
}

// animates the scene
function animate() {
    render()

    requestAnimationFrame(animate)
}

// initial draw of the scene
function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.setSize(windowWidth, windowHeight)

    document.body.appendChild(renderer.domElement)

    createScene()
    createCamera()

    render()

    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', onKeyDown)
}


