let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, camera, orthocamera, perspective1, perspective2, renderer, geometry, material, mesh, table

const background = '#404040'
const numberOfBalls = 15

const tableProperties = {
    color: '#0a6c03',
    width: 300,
    length: 120,
    height: 5, // A altura H das paredes da mesa deve ser tal que não permita que as bolas caiam para fora da mesa
    initX: 0,
    initY: 0,
    initZ: 0
}

const frontWallProperties = {
    color: '#8b4513',
    width: tableProperties.width, 
    height: tableProperties.length * 0.1,
    length: tableProperties.height
}

const sideWallProperties = {
    color: frontWallProperties.color,
    width: tableProperties.length, 
    height: frontWallProperties.height, 
    length: frontWallProperties.length
}

const cueProperties = {
    color: "#ffa54f",
    height: 50,
    radius: 2
}

const ballProperties = {
    color: '#ffffff',
    radius: frontWallProperties.height / 4
}

// all the camera properties
const cameraProperties = {
    cameraLeft: -tableProperties.width,
    cameraRight: tableProperties.width,
    cameraTop: tableProperties.width,
    cameraBottom: -tableProperties.width,
    x: 0,
    y: tableProperties.width*1.5,
    z: 0
}

const perspectiveCameraProperties = {
    cameraLeft: -tableProperties.width,
    cameraRight: tableProperties.width,
    cameraTop: tableProperties.width,
    cameraBottom: -tableProperties.width,
    x: 0,
    y: tableProperties.width*1.5,
    z: 0
}


// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

// updates the position of the orthogonal camera
function updateCameraPosition(obj) {
    obj.position.x = cameraProperties.x
    obj.position.y = cameraProperties.y
    obj.position.z = cameraProperties.z
    obj.lookAt(scene.position)
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createBall(obj, x, y, z) {
    ball = new THREE.Object3D()
    ball.userData = {}

    material = new THREE.MeshBasicMaterial({ color: ballProperties.color, wireframe: true })

    geometry = new THREE.SphereGeometry(ballProperties.radius, 10, 10)
    mesh = new THREE.Mesh(geometry, material)

    ball.add(mesh)
    ball.position.set(x, y, z)

    obj.add(ball)
    obj.userData.balls.push(ball)
}

function addTableTop(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(tableProperties.width, tableProperties.height, tableProperties.length)

    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    obj.add(mesh)
}

function addTableFrontWall(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(frontWallProperties.width, frontWallProperties.height, frontWallProperties.length)
    
    material = new THREE.MeshBasicMaterial({ color: frontWallProperties.color, wireframe: true })

    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    obj.add(mesh)
}

function addTableSideWall(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(sideWallProperties.width - 2 * frontWallProperties.length, sideWallProperties.height, sideWallProperties.length)
    
    material = new THREE.MeshBasicMaterial({ color: sideWallProperties.color, wireframe: true })

    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)
    mesh.rotation.y = Math.PI / 2

    obj.add(mesh)
}

// creates a circle at the (x,y,z) position
function createCue(obj, x, y, z, { rotX, rotY, rotZ }) {
    geometry = new THREE.CylinderGeometry(cueProperties.radius, cueProperties.radius/4, cueProperties.height);

    material = new THREE.MeshBasicMaterial({ color: cueProperties.color, wireframe: true })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)
    mesh.rotation.x += rotX
    mesh.rotation.y += rotY
    mesh.rotation.z += rotZ

    obj.add(mesh)

    return mesh
}

function createTable(x, y, z) {
    const table = new THREE.Object3D()

    material = new THREE.MeshBasicMaterial({ color: tableProperties.color, wireframe: true })

    table.userData = { balls: [] }

    addTableTop(table, 0, 0, 0)
    addTableFrontWall(table, 0, frontWallProperties.height/2 + tableProperties.height / 2, tableProperties.length / 2 - frontWallProperties.length / 2)
    addTableFrontWall(table, 0, frontWallProperties.height/2 + tableProperties.height / 2, -(tableProperties.length / 2 - frontWallProperties.length / 2))
    addTableSideWall(table, tableProperties.width / 2 - frontWallProperties.length / 2, frontWallProperties.height/2 + tableProperties.height / 2, 0)
    addTableSideWall(table, -(tableProperties.width / 2 - frontWallProperties.length / 2), frontWallProperties.height/2 + tableProperties.height / 2, 0)

    // fixed initial balls
    createBall(table, tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, tableProperties.length / 2 - frontWallProperties.length*2)
    createBall(table, -tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, tableProperties.length / 2 - frontWallProperties.length*2)
    createBall(table, tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, -(tableProperties.length / 2 - frontWallProperties.length*2))
    createBall(table, -tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, -(tableProperties.length / 2 - frontWallProperties.length*2))
    createBall(table, tableProperties.width / 2 - sideWallProperties.length*2, tableProperties.height / 2 + ballProperties.radius, 0)
    createBall(table, -(tableProperties.width / 2 - sideWallProperties.length*2), tableProperties.height / 2 + ballProperties.radius, 0)

    // randomly generated balls
    generateRandomBalls(table);

    scene.add(table)

    table.position.x = x
    table.position.y = y - tableProperties.height
    table.position.z = z

    console.log(table)
}

// creates the orthographic camera object
function createOrthographicCamera() {
    /* NAO APAGAR!!!!!! */ 
    //camera = new THREE.OrthographicCamera(cameraProperties.cameraLeft, cameraProperties.cameraRight, cameraProperties.cameraTop, cameraProperties.cameraBottom, 1, 1000)

    orthocamera = new THREE.OrthographicCamera(-tableProperties.width, tableProperties.width, tableProperties.length*1.5,
         -tableProperties.length*1.5, 1, 1000)

    updateCameraPosition(orthocamera)
}

function generateRandomBalls(obj) {
    const currentNumberOfBalls = obj.userData.balls.length
    for (let i = currentNumberOfBalls; i < numberOfBalls; i++) {
        generateRandomBall(obj);
    }
}

function generateRandomBall(obj) {
    const x = randomIntFromInterval(-(tableProperties.width / 2 - sideWallProperties.length*2), tableProperties.width / 2 - sideWallProperties.length*2)
    const y = tableProperties.height / 2 + ballProperties.radius
    const z = randomIntFromInterval(-(tableProperties.length / 2 - frontWallProperties.length*2), tableProperties.length / 2 - frontWallProperties.length*2)
    
    createBall(obj, x, y, z);
}

function createPerspectiveCameras() {
    perspective1 = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 1000)
    perspective2 = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 1000)

    updateCameraPosition(perspective1)
    updateCameraPosition(perspective2)

}

// creates the scene object
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    scene.add(new THREE.AxesHelper(10))

    createTable(tableProperties.initX, tableProperties.initY, tableProperties.initZ)

    let rotation = {rotX: Math.PI / 2, rotY: 0, rotZ: 0}
    createCue(scene, tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, tableProperties.length / 2 + cueProperties.height/2, rotation)
    createCue(scene, -tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, tableProperties.length / 2 + cueProperties.height/2, rotation)

    rotation = {rotX: - Math.PI / 2, rotY: 0, rotZ: 0}
    createCue(scene, -tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, -(tableProperties.length / 2 + cueProperties.height/2), rotation)
    createCue(scene, tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, -(tableProperties.length / 2 + cueProperties.height/2), rotation)

    rotation = {rotX: 0, rotY: 0, rotZ: -Math.PI / 2}
    createCue(scene, tableProperties.width / 2 + cueProperties.height / 2, tableProperties.height / 2 + ballProperties.radius, 0, rotation)
    
    rotation = {rotX: 0, rotY: 0, rotZ: Math.PI / 2}
    createCue(scene, -(tableProperties.width / 2 + cueProperties.height / 2), tableProperties.height / 2 + ballProperties.radius, 0, rotation)
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

//muda posição da camera e material do mobile
function switchCameraAndMaterial(event) {
    switch(event.key) {
        case '1':
            camera = orthocamera
            cameraProperties.x = 0
            cameraProperties.y = tableProperties.width * 1.5
            cameraProperties.z = 0
            break;
            
        case '2':
            camera = perspective1
            cameraProperties.x = tableProperties.width * 0.8
            cameraProperties.y = tableProperties.width * 1.3
            cameraProperties.z = tableProperties.length *1.5
            break;
                
        case '3':
            camera = perspective2
            cameraProperties.x = 0
            cameraProperties.y = tableProperties.width
            cameraProperties.z = tableProperties.width * 2
            break;

        case '0':
            scene.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe
                }
            })
            break;
    }
}

//Guarda as teclas que foram premidas
const controller = {

}

//Verifica que keys estão pressionadas e activa o movimento correspondente
const executeMoves = () => {
    Object.keys(controller).forEach(key=> {
      controller[key].pressed && controller[key].func(key)
    })
}

function checkScrollDirection(event) {
    if (checkScrollDirectionIsUp(event)) {
        if (cameraProperties.x > 0) cameraProperties.x -= 4
        if (cameraProperties.y > 0) cameraProperties.y -= 4
        if (cameraProperties.z > 0) cameraProperties.z -= 4
    } else {
        if (cameraProperties.x > 0) cameraProperties.x += 4
        if (cameraProperties.y > 0) cameraProperties.y += 4
        if (cameraProperties.z > 0) cameraProperties.z += 4
    }
}

function checkScrollDirectionIsUp(event) {
    if (event.wheelDelta) {
      return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
}

// animates the scene
function animate() {
    updateCameraPosition(camera)
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
    createOrthographicCamera()
    createPerspectiveCameras()

    camera = orthocamera


    render()

    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', switchCameraAndMaterial)
    window.addEventListener('wheel', checkScrollDirection);

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
