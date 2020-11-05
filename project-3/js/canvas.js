let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let light, scene, camera, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0

const background = '#000000'

const palanqueProperties = {
    radius: 25,
    height: 1.2,
    color: '#4c280f',
    rotationFactor: 100
}

const directionalLightProperties = {
    intensity: 1,
    color: '#ffffff'
}

const pointLightProperties = {
    color: "#FFFFFF",
    intensity: 1
}

const spotLightProperties = {
    color: "#FFFFFF",
    intensity: 3,
    penumbra: 0.2,
    angle: Math.PI/5,
    shadowMapSizeWidth: 1000,
    shadowMapSizeHeight: 1000
}

const holofoteProperties = {
    x: palanqueProperties.radius*1.1,
    y: palanqueProperties.radius*1.1,
    z: palanqueProperties.radius*1.1,
    coneRadius: palanqueProperties.radius*0.1,
    coneHeight: palanqueProperties.radius*0.2,
    openEnded: true,
    cylinderRadius: palanqueProperties.radius*0.02,
    cylinderHeight: palanqueProperties.radius*1.1,
    cylinderColor: "#5aaf9f",
    coneColor: "#5aaf9f"
}

const floorProperties = {
    width: palanqueProperties.radius * 3,
    depth: palanqueProperties.radius * 3,
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

function createCone(x, y, z) {
        cone= new THREE.Object3D()
        geometry = new THREE.ConeBufferGeometry(holofoteProperties.coneRadius, holofoteProperties.coneHeight, 32, 2,
            holofoteProperties.openEnded);
        material = new THREE.MeshPhongMaterial({ color: holofoteProperties.coneColor })
    
        geometry.applyMatrix4( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -Math.PI / 2, -Math.PI, 0 ) ) );
        mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
    
        mesh.position.set(x, y, z)
        mesh.lookAt(0, 0, 0)
        cone.add(mesh)
        scene.add(cone)
}

function createCylinder(x, y, z) {
    cylinder = new THREE.Object3D()
    geometry = new THREE.CylinderGeometry(holofoteProperties.cylinderRadius, holofoteProperties.cylinderRadius, 
        holofoteProperties.cylinderHeight, 20, 32)
    material = new THREE.MeshPhongMaterial({ color: holofoteProperties.cylinderColor })
    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.position.set(x, y/2, z)
    cylinder.add(mesh)
    scene.add(cylinder)
}

function createSphere(x, y, z) {
    sphere = new THREE.Object3D()
    geometry = new THREE.SphereGeometry(holofoteProperties.coneRadius, 20, 32)
    material = new THREE.MeshBasicMaterial({ color: holofoteProperties.cylinderColor })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x-holofoteProperties.coneHeight, y-holofoteProperties.coneHeight/2,
         z-holofoteProperties.coneHeight)
    sphere.add(mesh)
    scene.add(sphere)
}

function createHolofote(x, y, z) {
    holofote = new THREE.Object3D()

    //Criar o cone
    createCone(x, y, z)

    //create SpotLight
    createSpotLight(x*0.95, y*0.95, z*0.95)

    //create Cylinder
    createCylinder(x, y, z)

    //create Sphere
    createSphere(x, y, z)

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

    material = new THREE.MeshLambertMaterial({ color: floorProperties.color })

    mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true;

    mesh.position.set(x, y, z)

    floor.add(mesh)
    scene.add(floor)
}

function createPalanque(x, y, z) {
    palanque = new THREE.Object3D()
    geometry = new THREE.CylinderGeometry( palanqueProperties.radius, palanqueProperties.radius, palanqueProperties.height, 32);
    
    material = new THREE.MeshLambertMaterial({ color: palanqueProperties.color})

    mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true;

    mesh.position.set(x, y, z)

    palanque.add(mesh)
    scene.add(palanque)

    //Criar o CYBERTRUCK
    createCube(palanque, 0, cubeProperties.height, 0)

    //criar holofotes
    createHolofote(-holofoteProperties.x, holofoteProperties.y, holofoteProperties.z)

}

function rotatePalanque(degrees) {
    palanque.rotation.y += degrees
}

// updates the position of the orthogonal camera
function updateCameraPosition(obj, x, y, z, lookAt) {
    obj.position.x = x
    obj.position.y = y
    obj.position.z = z
    obj.lookAt(lookAt)
}

function createPerspectiveCamera() {
    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, floorProperties.depth*4)

    updateCameraPosition(camera, palanqueProperties.radius*3, floorProperties.depth*0.6, palanqueProperties.radius*3, scene.position)
}

function createDirectionalLight(x, y, z) {
    light = new THREE.DirectionalLight(directionalLightProperties.color, directionalLightProperties.intensity);
    light.castShadow = true;
    light.position.set(x, y, z);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);
}

function createPointLight(x, y, z) {
    const light = new THREE.PointLight(pointLightProperties.color, pointLightProperties.intensity)
    light.castShadow = true;
    light.position.set(x, y, z)
    scene.add(light)
}

function createSpotLight(x, y, z) {
    const light = new THREE.SpotLight(spotLightProperties.color, spotLightProperties.intensity)
    light.castShadow = true;
    light.shadow.mapSize.width = spotLightProperties.shadowMapSizeWidth
    light.shadow.mapSize.height = spotLightProperties.shadowMapSizeHeight
    light.penumbra = spotLightProperties.penumbra
    light.angle = spotLightProperties.angle
    light.position.set(x, y, z);
    light.target.position.set(0, 0, 0);
    scene.add(light)
    scene.add(light.target)
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
    createDirectionalLight(palanqueProperties.radius,palanqueProperties.radius, palanqueProperties.radius)
    createPerspectiveCamera()
    render()

    
    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', keysPressed)
}

function keysPressed(event) {
    switch(event.code) {
        case 'ArrowRight':
            rotatePalanque(Math.PI/palanqueProperties.rotationFactor)
            break;
        case 'ArrowLeft':
            rotatePalanque(-Math.PI/palanqueProperties.rotationFactor)
            break;
        case 'Numpad6':

            break;
        case 'Numpad4':
            break;
    }
}