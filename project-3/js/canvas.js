let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let dirLight, scene, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0

const background = '#000000'

const palanqueProperties = {
    radius: 50,
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

function createCube(obj, x, y, z) {
    cube = new THREE.Object3D()

    geometry = new THREE.PlaneGeometry(20, 20);

    /*geometry = new THREE.BoxGeometry(cubeProperties.width, cubeProperties.height, cubeProperties.depth);
*/
    material = new THREE.MeshPhongMaterial({ color: cubeProperties.color, side: THREE.DoubleSide })

    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

   /* mesh.rotation.x = Math.PI/4
    mesh.rotation.y = Math.PI/4*/
    mesh.position.set(x, y, z)

    cube.add(mesh)

    obj.add(cube)
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
    createCube(palanque, 0, cubeProperties.height / 2 + palanqueProperties.height, 0)

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
