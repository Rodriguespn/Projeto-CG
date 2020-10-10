let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, camera, renderer, geometry, material, mesh, mobile

const numberOfLevels = 5

// the 
const objectSpeed = {
    mobile: 0.05, 
    segment: 0.02
}

// all the camera properties
const cameraProperties = {
    cameraLeft: -20,
    cameraRight: 20,
    cameraTop: 20,
    cameraBottom: -20,
    x: 0, 
    y: 0, 
    z: 30
}

// the default color of the diferente objects
const objectsColors = {
    wire: '#5e5e5e',
    cube: '#D8122F',
    circle: '#44EDED',
    ellipse: '#0CEE6C',
    background: '#d0e7e5'
}

// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

// creates a cube at the (x,y,z) position
function createCube(x, y, z) {
    geometry = new THREE.CubeGeometry(2, 0.1, 1)
    material = new THREE.MeshBasicMaterial({ color: objectsColors.cube, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    return mesh
}

// creates a ellipse at the (x,y,z) position
function createEllipse(x, y, z) {
    const path = new THREE.Shape();
    path.absellipse(0,0,0.5,1,0, Math.PI*2, false,0);
    geometry = new THREE.ShapeBufferGeometry(path);

    material = new THREE.MeshBasicMaterial({ color: objectsColors.ellipse, side: THREE.DoubleSide, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.rotation.x = Math.PI/2
    mesh.rotation.z = Math.PI/2

    mesh.position.set(x, y, z)

    return mesh
}

// creates a circle at the (x,y,z) position
function createCircle(x, y, z) {
    geometry = new THREE.CylinderGeometry(1, 1, 0.1);

    material = new THREE.MeshBasicMaterial({ color: objectsColors.circle, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    return mesh
}

// creates a vertical cable at the (x,y,z) position
function createVerticalWire(heigth, x, y, z) {
    geometry = new THREE.CylinderGeometry(0.05, 0.05, heigth, 8)

    material = new THREE.MeshBasicMaterial({ color: objectsColors.wire, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    return mesh
}

// creates a horizontal cable at the (x,y,z) position
function createHorizontalWire(height, x, y, z) {
    
    geometry = new THREE.CylinderGeometry(0.05, 0.05, height, 8)

    material = new THREE.MeshBasicMaterial({ color: objectsColors.wire, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.rotation.z = Math.PI / 2
    mesh.position.set(x, y, z)

    return mesh
}

function createMobileSegment(vertWire, horWire, leftObj, rightObj, name) {
    let segment = new THREE.Object3D()

    segment.userData = { speed: objectSpeed.segment }

    segment.add(vertWire)
    segment.add(horWire)
    segment.add(leftObj)
    segment.add(rightObj)

    segment.name = name

    segment.position.set(3, 0, 0)
    //console.log(segment.position)
    return segment
}

// creates the mobile
function createMobile(x, y, z) {
    mobile = new THREE.Object3D()

    mobile.userData = { speed: objectSpeed.mobile }

    // Create Segments
    const seg1 = createMobileSegment(createVerticalWire(4, 0, 2, 0), createHorizontalWire(10, 0, 0, 0), createCube(-6, 0, 0), createEllipse(6, 0, 0), "first")
    const seg2 = createMobileSegment(createVerticalWire(2, 0, -1, 0), createHorizontalWire(10, 0, -2, 0), createCube(6, -2, 0), createCircle(-6, -2, 0),  "second")
    const seg3 = createMobileSegment(createVerticalWire(2, 0, -3, 0), createHorizontalWire(10, 0, -4, 0), createCircle(-6, -4, 0), createEllipse(6, -4, 0),  "third")
    const seg4 = createMobileSegment(createVerticalWire(2, 0, -5, 0), createHorizontalWire(10, 0, -6, 0), createCube(-6, -6, 0), createCircle(6, -6, 0),  "fourth")
    const seg5 = createMobileSegment(createVerticalWire(2, 0, -7, 0), createHorizontalWire(10, 0, -8, 0), createCube(-6, -8, 0), createCube(6, -8, 0),  "fifth")

    // Object Nesting
    mobile.add(seg1)
    seg1.add(seg2)
    seg2.add(seg3)
    seg3.add(seg4)
    seg4.add(seg5)

    scene.add(mobile)

    mobile.position.x = x-3
    mobile.position.y = y
    mobile.position.z = z
    mobile.name = "mobile"

    console.log(mobile)
}

// updates the position of the orthogonal camera
function updateCameraPosition() {
    camera.position.x = cameraProperties.x
    camera.position.y = cameraProperties.y
    camera.position.z = cameraProperties.z
    camera.lookAt(scene.position)
}

// creates the camera object
function createCamera() {
    camera = new THREE.OrthographicCamera(cameraProperties.cameraLeft, cameraProperties.cameraRight, cameraProperties.cameraTop, cameraProperties.cameraBottom, 1, 1000)

    updateCameraPosition()
}

// creates the scene object
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(objectsColors.background);

    scene.add(new THREE.AxesHelper(10))

    createMobile(0, 0, 0)
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

// roda um determinado V consoante a tecla que foi premida
function rotateVs(e) {
    let segment = null
    switch (e) {
        // controla v1
        case 'Q':
        case 'q':
            segment = mobile.getObjectByName('first')
            segment.rotation.y += segment.userData.speed
            break;

        case 'W':
        case 'w':
            segment = mobile.getObjectByName('first')
            segment.rotation.y -= segment.userData.speed
            break;

        // controla v2
        case 'A':
        case 'a':
            segment = mobile.getObjectByName('second')
            segment.rotation.y += segment.userData.speed
            break;

        case 'D':
        case 'd':
            segment = mobile.getObjectByName('second')
            segment.rotation.y -= segment.userData.speed
            break;

        // controla v3
        case 'Z':
        case 'z':
            segment = mobile.getObjectByName('fourth')
            segment.rotation.y += segment.userData.speed
            break;

        case 'C':
        case 'c':
            segment = mobile.getObjectByName('fourth')
            segment.rotation.y -= segment.userData.speed
            break;

        default:
            break;
    }
}

//muda posição da camera e material do mobile
function switchCameraAndMaterial(event) {
    switch(event.key) {
        case '1':
            cameraProperties.x = 0
            cameraProperties.y = 0
            cameraProperties.z = 30
            break;
            
        case '2':
            cameraProperties.x = 30
            cameraProperties.y = 0
            cameraProperties.z = 0
            break;
                
        case '3':
            cameraProperties.x = 0
            cameraProperties.y = 30
            cameraProperties.z = 0
            break;
    
        case '4':
            scene.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe
                }
            })
            break;
    }
}

// moves the mobile based on the arrow key pressed
function moveMobile(e) {
    switch (e) {
        case 'ArrowUp':
            mobile.position.z -= mobile.userData.speed
            break;

        case 'ArrowDown':
            mobile.position.z += mobile.userData.speed
            break;

        case 'ArrowLeft':
            mobile.position.x -= mobile.userData.speed
            break;

        case 'ArrowRight':
            mobile.position.x += mobile.userData.speed
            break;
            
        default:
            break;
    }
}

//Guarda as teclas que foram premidas
const controller = {
    '1': {pressed: false, func: switchCameraAndMaterial},
    '2': {pressed: false, func: switchCameraAndMaterial},
    '3': {pressed: false, func: switchCameraAndMaterial},
    '4': {pressed: false, func: switchCameraAndMaterial},
    'q': {pressed: false, func: rotateVs},
    'Q': {pressed: false, func: rotateVs},
    'w': {pressed: false, func: rotateVs},
    'W': {pressed: false, func: rotateVs},
    'a': {pressed: false, func: rotateVs},
    'A': {pressed: false, func: rotateVs},
    'd': {pressed: false, func: rotateVs},
    'D': {pressed: false, func: rotateVs},
    'z': {pressed: false, func: rotateVs},
    'Z': {pressed: false, func: rotateVs},
    'c': {pressed: false, func: rotateVs},
    'C': {pressed: false, func: rotateVs},
    'ArrowUp': {pressed: false, func: moveMobile},
    'ArrowDown': {pressed: false, func: moveMobile},
    'ArrowLeft': {pressed: false, func: moveMobile},
    'ArrowRight': {pressed: false, func: moveMobile},
  }

//Verifica que keys estão pressionadas e activa o movimento correspondente
const executeMoves = () => {
    Object.keys(controller).forEach(key=> {
      controller[key].pressed && controller[key].func(key)
    })
}

// animates the scene
function animate() {
    updateCameraPosition()
    executeMoves()

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
    window.addEventListener('keydown', switchCameraAndMaterial)

    //actualiza controller
    window.addEventListener("keydown", (e) => {
        if(controller[e.key]){
          controller[e.key].pressed = true
        }
      })

    window.addEventListener("keyup", (e) => {
        if(controller[e.key]){
          controller[e.key].pressed = false
        }
      })
}
