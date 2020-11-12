let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let dirLight, scene, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0

const background = '#000000'

const palanqueProperties = {
    radius: 50,
    height: 3,
    color: '#4c280f',
    rotationFactor: 100
}

const floorProperties = {
    width: palanqueProperties.radius * 4,
    depth: palanqueProperties.radius * 4,
    height: palanqueProperties.height * 0.8,
    color: '#7b836a'
}

const carProperties = {
    width: palanqueProperties.radius,
    depth: palanqueProperties.radius,
    height: palanqueProperties.height * 15,
    wheelsProperties: {
        radius: palanqueProperties.radius * 0.15,
        height: palanqueProperties.radius * 0.15,
        color: '#0c0b0c'
    },
    color: '#C0C0C0'
}

const directionalLightProperties = {
    intensityOff: 0,
    intensityOn: 1,
    color: '#ffffff'
}

class DirLight extends THREE.Object3D {
    constructor(x, y, z) {
        super()
        this.active = true
        this.light = createDirectionalLight(x, y, z)
    }

    turnLightOnorOff() {
        if (this.active){
            //vai desligar a luz
            this.light.intensity = directionalLightProperties.intensityOff
            this.active = false
        }
        else {
            this.light.intensity = directionalLightProperties.intensityOn
            this.active = true
        }
    }
}

function createDirectionalLight(x, y, z) {
    var light = new THREE.DirectionalLight(directionalLightProperties.color, directionalLightProperties.intensityOn);
    light.castShadow = true;
    light.position.set(x, y, z);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);
    return light
}

function createWheel(obj, x, y, z) {
    const wheel = new THREE.Object3D()

    geometry = new THREE.CylinderGeometry(carProperties.wheelsProperties.radius, carProperties.wheelsProperties.radius, carProperties.wheelsProperties.height, 100);

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.wheelsProperties.color })
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.wheelsProperties.color })
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.wheelsProperties.color })

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    basicMesh = new THREE.Mesh(geometry, basicMaterial)
    lambertMesh = new THREE.Mesh(geometry, lambertMaterial)

    phongMesh.receiveShadow = true
    phongMesh.castShadow = true
    lambertMesh.receiveShadow = true
    lambertMesh.castShadow = true
    basicMesh.receiveShadow = true
    basicMesh.castShadow = true

    phongMesh.position.set(x, y, z)
    basicMesh.position.set(x, y, z)
    lambertMesh.position.set(x, y, z)

    phongMesh.rotation.set(Math.PI / 2, 0, 0)
    lambertMesh.rotation.set(Math.PI / 2, 0, 0)
    basicMesh.rotation.set(Math.PI / 2, 0, 0)
    
    wheel.add(phongMesh)

    wheel.name = "wheel"

    obj.add(wheel)
}

function createWheelConnection(obj, x, y, z, { rotX, rotY, rotZ }) {
    const wheelConnection = new THREE.Object3D()

    geometry = new THREE.BoxGeometry(carProperties.wheelsProperties.radius / 2, carProperties.depth - carProperties.wheelsProperties.height, carProperties.wheelsProperties.radius / 2);

    phongMaterial = new THREE.MeshPhongMaterial({ color: "#3a363b" })
    basicMaterial = new THREE.MeshBasicMaterial({ color: "#3a363b" })
    lambertMaterial = new THREE.MeshLambertMaterial({ color: "#3a363b" })

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    basicMesh = new THREE.Mesh(geometry, basicMaterial)
    lambertMesh = new THREE.Mesh(geometry, lambertMaterial)

    phongMesh.receiveShadow = true
    phongMesh.castShadow = true
    lambertMesh.receiveShadow = true
    lambertMesh.castShadow = true
    basicMesh.receiveShadow = true
    basicMesh.castShadow = true

    phongMesh.position.set(x, y, z)
    basicMesh.position.set(x, y, z)
    lambertMesh.position.set(x, y, z)

    phongMesh.rotation.set(rotX, rotY, rotZ)
    lambertMesh.rotation.set(rotX, rotY, rotZ)
    basicMesh.rotation.set(rotX, rotY, rotZ)
    
    wheelConnection.add(phongMesh)
    wheelConnection.name = "wheel connection"

    obj.add(wheelConnection)
}

function createMainWheelConnection(obj, x, y, z, { rotX, rotY, rotZ }) {
    const wheelConnection = new THREE.Object3D()

    geometry = new THREE.BoxGeometry(carProperties.wheelsProperties.radius / 2, carProperties.depth - carProperties.wheelsProperties.radius / 2, carProperties.wheelsProperties.radius / 2);

    phongMaterial = new THREE.MeshPhongMaterial({ color: "#3a363b" })
    basicMaterial = new THREE.MeshBasicMaterial({ color: "#3a363b" })
    lambertMaterial = new THREE.MeshLambertMaterial({ color: "#3a363b" })

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    basicMesh = new THREE.Mesh(geometry, basicMaterial)
    lambertMesh = new THREE.Mesh(geometry, lambertMaterial)

    phongMesh.receiveShadow = true
    phongMesh.castShadow = true
    lambertMesh.receiveShadow = true
    lambertMesh.castShadow = true
    basicMesh.receiveShadow = true
    basicMesh.castShadow = true

    phongMesh.position.set(x, y, z)
    basicMesh.position.set(x, y, z)
    lambertMesh.position.set(x, y, z)

    phongMesh.rotation.set(rotX, rotY, rotZ)
    lambertMesh.rotation.set(rotX, rotY, rotZ)
    basicMesh.rotation.set(rotX, rotY, rotZ)
    
    wheelConnection.add(phongMesh)

    wheelConnection.name = "main wheel connection"

    obj.add(wheelConnection)
}

function createChassis(obj, x, y, z) {
    const chassis = new THREE.Object3D()
    const wheelsY = y - carProperties.height / 2 + carProperties.wheelsProperties.radius
    const wheelsXOffset = carProperties.width / 2
    const wheelsZOffset = carProperties.depth / 2
    createWheel(chassis, x + wheelsXOffset, wheelsY, z + wheelsZOffset)
    createWheel(chassis, x + wheelsXOffset, wheelsY, z - wheelsZOffset)
    createWheel(chassis, x - wheelsXOffset, wheelsY, z + wheelsZOffset)
    createWheel(chassis, x - wheelsXOffset, wheelsY, z - wheelsZOffset)

    let rotation = { rotX: Math.PI / 2, rotY: 0, rotZ: 0 }
    createWheelConnection(chassis, x + wheelsXOffset, wheelsY, z, rotation)

    rotation = { rotX: Math.PI / 2, rotY: 0, rotZ: 0 }
    createWheelConnection(chassis, x - wheelsXOffset, wheelsY, z, rotation)

    rotation = { rotX: 0, rotY: 0, rotZ: Math.PI / 2 }
    createMainWheelConnection(chassis, x, wheelsY, z, rotation)
    
    obj.add(chassis)
}

function generateTriangle(vertices) {
    
    const positions = []

    for (const vertex of vertices) {
        positions.push(...vertex);
    }

    geometry = new THREE.BufferGeometry()
    const positionNumComponents = 3
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        
    material = new THREE.MeshBasicMaterial({ color: carProperties.color, side: THREE.DoubleSide });
    mesh = new THREE.Mesh( geometry, material );
    
    mesh.receiveShadow = true
    mesh.castShadow = true
        
    return mesh
}

function createFragment(obj, x, y, z, vertices) {
    mesh = generateTriangle(vertices)
    
    mesh.position.set(x, y, z)
    mesh.name = "fragment"

    obj.add(mesh)
}

function createSideWall(obj, x, y, z, side) {
    const wall = new THREE.Object3D()
    
    let vx = carProperties.width / 2 - carProperties.wheelsProperties.radius*1.1
    let vy = -carProperties.height / 2 + carProperties.wheelsProperties.radius
    let vz = carProperties.depth / 2 * side
    let offSet = carProperties.wheelsProperties.radius

    let vertices = [
        [vx, vy,  vz],
        [-vx, vy,  vz],
        [-vx, vy+offSet,  vz]
    ]

    createFragment(wall, x, y, z, vertices)

    vertices = [
        [vx, vy,  vz],
        [vx, vy+offSet,  vz],
        [-vx, vy+offSet,  vz]
    ]

    createFragment(wall, x, y, z, vertices)

    vx = carProperties.width / 2 - carProperties.wheelsProperties.radius*1.1
    vy = -carProperties.height / 2 + carProperties.wheelsProperties.radius*2
    vz = carProperties.depth / 2 * side

    vertices = [
        [-vx, vy,  vz],
        [-vx-offSet/2, vy+offSet/2,  vz],
        [vx+offSet/2, vy+offSet/2,  vz]
    ]

    createFragment(wall, x, y, z, vertices)

    vertices = [
        [vx, vy,  vz],
        [-vx, vy,  vz],
        [vx+offSet/2, vy+offSet/2,  vz]
    ]

    createFragment(wall, x, y, z, vertices)

    vx = carProperties.width / 2 - carProperties.wheelsProperties.radius*1.1
    vy = -carProperties.height / 2 + carProperties.wheelsProperties.radius*2
    vz = carProperties.depth / 2 * side
    
    vertices = [
        [0, carProperties.height / 2,  carProperties.depth / 4 * side],
        [-vx-offSet/2, vy+offSet/2,  vz],
        [vx+offSet/2, vy+offSet/2,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)
    
    vx = carProperties.width / 2 - carProperties.wheelsProperties.radius*1.1
    vy = -carProperties.height / 2 + carProperties.wheelsProperties.radius*2
    vz = carProperties.depth / 2 * side
    
    vertices = [
        [0, carProperties.height / 2,  carProperties.depth / 4 *side],
        [-vx-offSet/2, vy+offSet/2,  vz],
        [-vx-offSet, vy+offSet,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)
    
    vertices = [
        [0, carProperties.height / 2,  carProperties.depth / 4 *side],
        [vx+offSet/2, vy+offSet/2,  vz],
        [vx+offSet*1.5, vy+offSet/2,  vz]
    ]

    createFragment(wall, x, y, z, vertices)

    vertices = [
        [0, carProperties.height / 2,  carProperties.depth / 4 *side],
        [vx+offSet*1.5, vy+offSet/2,  vz],
        [carProperties.width, vy+offSet,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)
    
    vertices = [
        [vx+offSet*2.25, -carProperties.height / 2 + carProperties.wheelsProperties.radius * 2,  vz],
        [vx+offSet*1.5, vy+offSet/2,  vz],
        [carProperties.width, vy+offSet,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)
    
    vertices = [
        [vx+offSet*2.25, -carProperties.height / 2 + carProperties.wheelsProperties.radius * 2,  vz],
        [carProperties.width, -carProperties.height / 2 + carProperties.wheelsProperties.radius * 1.5,  vz],
        [carProperties.width, vy+offSet,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)
    
    vertices = [
        [vx+offSet*2.25, -carProperties.height / 2 + carProperties.wheelsProperties.radius * 2,  vz],
        [carProperties.width, -carProperties.height / 2 + carProperties.wheelsProperties.radius * 1.5,  vz],
        [vx+offSet*2.25, -carProperties.height / 2 + carProperties.wheelsProperties.radius,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)

    vertices = [
        [-vx-offSet/2, vy+offSet/2,  vz],
        [-vx-offSet, vy+offSet,  vz],
        [-vx-offSet*1.5, vy+offSet/2,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)

    vertices = [
        [-carProperties.depth, vy+offSet/2,  vz],
        [-vx-offSet, vy+offSet,  vz],
        [-vx-offSet*1.5, vy+offSet/2,  vz]
    ]
    
    createFragment(wall, x, y, z, vertices)

    vertices = [
        [-carProperties.depth, vy+offSet/2, vz],
        [-vx-offSet*1.5, vy+offSet/2, vz],
        [-vx-offSet*2.25, vy, vz]
    ]
    
    createFragment(wall, x, y, z, vertices)

    vertices = [
        [-carProperties.depth, vy+offSet/2, vz],
        [-vx-offSet*2.25, vy, vz],
        [-carProperties.depth, -carProperties.height / 2 + carProperties.wheelsProperties.radius, vz]
    ]
    
    createFragment(wall, x, y, z, vertices)
    
    vertices = [
        [-vx-offSet*2.25, -carProperties.height / 2 + carProperties.wheelsProperties.radius, vz],
        [-vx-offSet*2.25, vy, vz],
        [-carProperties.depth, -carProperties.height / 2 + carProperties.wheelsProperties.radius, vz]
    ]
    
    createFragment(wall, x, y, z, vertices)

    wall.name = "wall"
    obj.add(wall)
}

function createCyberTruck(obj, x, y, z) {
    const car = new THREE.Object3D()
    
    createChassis(car, x, y, z)
    /* left: 1
       right: -1 
    */
    createSideWall(car, x, y, z, 1) 
    createSideWall(car, x, y, z, -1)

    obj.add(car)
    console.log("car")
    console.log(car)
}

function createFloor(x, y, z) {
    floor = new THREE.Object3D()
    geometry = new THREE.BoxGeometry(floorProperties.width, floorProperties.height, floorProperties.depth);

    phongMaterial = new THREE.MeshPhongMaterial({ color: floorProperties.color })
    basicMaterial = new THREE.MeshBasicMaterial({ color: floorProperties.color })
    lambertMaterial = new THREE.MeshLambertMaterial({ color: floorProperties.color })

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    basicMesh = new THREE.Mesh(geometry, basicMaterial)
    lambertMesh = new THREE.Mesh(geometry, lambertMaterial)

    phongMesh.receiveShadow = true;
    lambertMesh.receiveShadow = true;

    phongMesh.position.set(x, y, z)
    basicMesh.position.set(x, y, z)
    lambertMesh.position.set(x, y, z)

    floor.add(phongMesh)
    //floor.add(basicMesh)
    //floor.add(lambertMesh)
    scene.add(floor)
}

function createPalanque(x, y, z) {
    palanque = new THREE.Object3D()
    geometry = new THREE.CylinderGeometry( palanqueProperties.radius, palanqueProperties.radius, palanqueProperties.height, 32);


    phongMaterial = new THREE.MeshPhongMaterial({ color: palanqueProperties.color})
    basicMaterial = new THREE.MeshBasicMaterial({ color: palanqueProperties.color})
    lambertMaterial = new THREE.MeshLambertMaterial({ color: palanqueProperties.color})

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    basicMesh = new THREE.Mesh(geometry, basicMaterial)
    lambertMesh = new THREE.Mesh(geometry, lambertMaterial)

    phongMesh.receiveShadow = true;
    lambertMesh.receiveShadow = true;

    phongMesh.position.set(x, y, z)
    basicMesh.position.set(x, y, z)
    lambertMesh.position.set(x, y, z)

    palanque.add(phongMesh)
    //palanque.add(basicMesh)
    //palanque.add(lambertMesh)
    scene.add(palanque)

    //Criar o CYBERTRUCK
    //createCube(palanque, 0, carProperties.height / 2 + palanqueProperties.height, 0)

    createCyberTruck(palanque, 0, carProperties.height / 2 + palanqueProperties.height, 0)

}

function rotatePalanque(degrees) {
    palanque.rotation.y += degrees
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

    //criar luz direcional
    dirLight = new DirLight(palanqueProperties.radius,palanqueProperties.radius, palanqueProperties.radius)

    //criar holofotes
    holofote1 = new Holofote(-holofoteProperties.x, holofoteProperties.y, holofoteProperties.z)
    holofote2 = new Holofote(holofoteProperties.x, holofoteProperties.y, 0)
    holofote3 = new Holofote(holofoteProperties.x * 0.3, holofoteProperties.y*1.3, -holofoteProperties.z)
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
    createPerspectiveCamera()
    createOrthographicCamera(floorProperties.width, 0, 0)
    camera = perspectiveCamera

    console.log(holofote1)

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    render()

    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', keysPressed)
    window.addEventListener('keyup', keysReleased)
}
