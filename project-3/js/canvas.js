let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let dirLight, scene, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0

const background = '#000000'

const palanqueProperties = {
    radius: 150,
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
    height: palanqueProperties.height * 20,
    wheelsProperties: {
        radius: palanqueProperties.radius * 0.15,
        height: palanqueProperties.radius * 0.15,
        color: '#0c0b0c'
    },
    color: '#024059'
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

function createCyberTruck(obj, x, y, z) {
    const car = new THREE.Object3D()
    
    createChassis(car, x, y, z)

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
    holofote3 = new Holofote(holofoteProperties.x*0.3, holofoteProperties.y*1.3, -holofoteProperties.z)
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
