let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, camera, orthocamera, perspective1, perspective2, renderer, geometry, material, mesh, table, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0 

const background = '#404040'
const numberOfBalls = 20
const stopVelocity = 5
const initFrictionCoefficient = 0.2 // ranges between [0,1]

/*
    Vicente: Rodar Tacos / Tacada / Camara q segue a bola
    Pedro: Bola-Bola / Bola-Parede
    João: Buraco 3D / Queda das bolas no infinito / gerar bolas com movimento inicial
*/

const tableProperties = {
    color: '#0a6c03',
    width: 300,
    length: 120,
    height: 10, // A altura H das paredes da mesa deve ser tal que não permita que as bolas caiam para fora da mesa
    initX: 0,
    initY: 0,
    initZ: 0
}

const frontWallProperties = {
    color: '#8b4513',
    width: tableProperties.width, 
    height: tableProperties.height,
    length: tableProperties.length * 0.1
}

const sideWallProperties = {
    color: frontWallProperties.color,
    width: tableProperties.length, 
    height: frontWallProperties.height, 
    length: frontWallProperties.length
}

const cueProperties = {
    color: "#ffa54f",
    selectedColor: "#fc4903", 
    height: 100,
    radius: 2,
    maxAngle: Math.PI / 3,
    minAngle: -Math.PI / 3
}

const ballProperties = {
    color: '#ffffff',
    radius: frontWallProperties.height / 4
}

const initialVelocity = {
    x: 50,
    y: 0,
    z: 50
}

const acceleration = {
    x: initialVelocity.x * initFrictionCoefficient,
    y: initialVelocity.y * initFrictionCoefficient,
    z: initialVelocity.z * initFrictionCoefficient,   
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

function randomFromInterval(min, max) { // min and max included 
    return Math.random() * (max - min + 1) + min
}

function randomIntFromInterval(min, max) {
    return Math.floor(randomFromInterval(min, max))
}

function createBall(obj, x, y, z, vx, vy, vz, ax, ay, az) {
    ball = new THREE.Object3D()

    ball.userData = { speed: {x: vx, y: vy, z: vz }, acceleration: { x: ax, y: ay, z: az } }

    material = new THREE.MeshBasicMaterial({ color: ballProperties.color, wireframe: false })

    geometry = new THREE.SphereGeometry(ballProperties.radius, ballProperties.radius*10, ballProperties.radius*10)
    mesh = new THREE.Mesh(geometry, material)

    ball.add(mesh)
    ball.position.set(x, y, z)
    ball.name = "ball"

    obj.add(ball)
    obj.userData.balls.push(ball)

    return ball
}

function generateRandomBalls(obj) {
    for (let i = 0; i < numberOfBalls; i++) {
        ball = generateRandomBall(obj);
    }
}

function generateRandomBall(obj) {
    const x = randomIntFromInterval(-(tableProperties.width / 2 - sideWallProperties.length*2-ballProperties.radius*2), tableProperties.width / 2 - sideWallProperties.length*2-ballProperties.radius*2)
    const y = tableProperties.height / 2 + ballProperties.radius
    const z = randomIntFromInterval(-(tableProperties.length / 2 - frontWallProperties.length*2-ballProperties.radius*2), tableProperties.length / 2 - frontWallProperties.length*2-ballProperties.radius*2)
    
    const vx = randomFromInterval(-initialVelocity.x, initialVelocity.x)
    const vy = randomFromInterval(-initialVelocity.y, initialVelocity.y)
    const vz = randomFromInterval(-initialVelocity.z, initialVelocity.z)

    const ax = -1 * vx / Math.abs(vx) * acceleration.x
    const ay = -1 * vy / Math.abs(vy) * acceleration.y
    const az = -1 * vz / Math.abs(vz) * acceleration.z

    return createBall(obj, x, y, z, vx, vy, vz, ax, ay, az)
}

function addTableTop(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(tableProperties.width, tableProperties.height, tableProperties.length)

    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    obj.add(mesh)
}

function addTableFrontWall(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(frontWallProperties.width, frontWallProperties.height, frontWallProperties.length)
    
    material = new THREE.MeshBasicMaterial({ color: frontWallProperties.color, wireframe: false })

    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)

    obj.add(mesh)
}

function addTableSideWall(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(sideWallProperties.width - 2 * frontWallProperties.length, sideWallProperties.height, sideWallProperties.length)
    
    material = new THREE.MeshBasicMaterial({ color: sideWallProperties.color, wireframe: false })

    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)
    mesh.rotation.y = Math.PI / 2

    obj.add(mesh)
}

// creates a circle at the (x,y,z) position
function createCue(obj, x, y, z, { rotX, rotY, rotZ }) {
    geometry = new THREE.CylinderGeometry(cueProperties.radius, cueProperties.radius/4, cueProperties.height);

    material = new THREE.MeshBasicMaterial({ color: cueProperties.color, wireframe: false })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x, y, z)
    mesh.rotation.x += rotX
    mesh.rotation.y += rotY
    mesh.rotation.z += rotZ

    obj.add(mesh)

    return mesh
}

function createTable(x, y, z) {
    table = new THREE.Object3D()

    material = new THREE.MeshBasicMaterial({ color: tableProperties.color, wireframe: false })

    table.userData = { balls: [], cues: [] }

    addTableTop(table, 0, 0, 0)
    addTableFrontWall(table, 0, frontWallProperties.height / 2 + tableProperties.height / 2, tableProperties.length / 2 - frontWallProperties.length / 2)
    addTableFrontWall(table, 0, frontWallProperties.height / 2 + tableProperties.height / 2, -(tableProperties.length / 2 - frontWallProperties.length / 2))
    addTableSideWall(table, tableProperties.width / 2 - frontWallProperties.length / 2, frontWallProperties.height/2 + tableProperties.height / 2, 0)
    addTableSideWall(table, -(tableProperties.width / 2 - frontWallProperties.length / 2), frontWallProperties.height/2 + tableProperties.height / 2, 0)

    // fixed initial balls
    /*
    createBall(table, tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, tableProperties.length / 2 - frontWallProperties.length*2)
    createBall(table, -tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, tableProperties.length / 2 - frontWallProperties.length*2)
    createBall(table, tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, -(tableProperties.length / 2 - frontWallProperties.length*2))
    createBall(table, -tableProperties.width / 4, tableProperties.height / 2 + ballProperties.radius, -(tableProperties.length / 2 - frontWallProperties.length*2))
    createBall(table, tableProperties.width / 2 - sideWallProperties.length*2, tableProperties.height / 2 + ballProperties.radius, 0)
    createBall(table, -(tableProperties.width / 2 - sideWallProperties.length*2), tableProperties.height / 2 + ballProperties.radius, 0)
    */

    let rotation = {rotX: Math.PI / 2, rotY: 0, rotZ: 0}
    createCue(table, tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, tableProperties.length / 2 + cueProperties.height/2, rotation)
    createCue(table, -tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, tableProperties.length / 2 + cueProperties.height/2, rotation)

    rotation = {rotX: - Math.PI / 2, rotY: 0, rotZ: 0}
    createCue(table, -tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, -(tableProperties.length / 2 + cueProperties.height/2), rotation)
    createCue(table, tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, -(tableProperties.length / 2 + cueProperties.height/2), rotation)

    rotation = {rotX: 0, rotY: 0, rotZ: -Math.PI / 2}
    createCue(table, tableProperties.width / 2 + cueProperties.height / 2, tableProperties.height / 2 + ballProperties.radius, 0, rotation)
    
    rotation = {rotX: 0, rotY: 0, rotZ: Math.PI / 2}
    createCue(table, -(tableProperties.width / 2 + cueProperties.height / 2), tableProperties.height / 2 + ballProperties.radius, 0, rotation) 

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

function detectRightWallCollision(ball) {
    const radius = ballProperties.radius
    const border = tableProperties.width/2 - (radius+sideWallProperties.length)
    if (ball.position.x > border) {
        ball.position.x = border
        ball.userData.speed.x = -ball.userData.speed.x
        ball.userData.acceleration.x = -ball.userData.acceleration.x
    }
}

function detectLeftWallCollision(ball) {
    const radius = ballProperties.radius
    const border = -(tableProperties.width/2 - (radius+sideWallProperties.length))
    if (ball.position.x < border) {
        ball.position.x = border
        ball.userData.speed.x = -ball.userData.speed.x
        ball.userData.acceleration.x = -ball.userData.acceleration.x
    }
}

function detectTopWallCollision(ball) {
    const radius = ballProperties.radius
    const border = tableProperties.length / 2 - (radius+frontWallProperties.length)
    if (ball.position.z > border) {
        ball.position.z = border
        ball.userData.speed.z = -ball.userData.speed.z
        ball.userData.acceleration.z = -ball.userData.acceleration.z
    }
}

function detectBottomWallCollision(ball) {
    const radius = ballProperties.radius
    const border = -(tableProperties.length/2 - (radius+frontWallProperties.length))
    if (ball.position.z < border) {
        ball.position.z = border
        ball.userData.speed.z = -ball.userData.speed.z
        ball.userData.acceleration.z = -ball.userData.acceleration.z
    }
}

function detectWallCollision() {
    table.userData.balls.forEach((ball) => {
        detectRightWallCollision(ball)
        detectLeftWallCollision(ball)
        detectTopWallCollision(ball)
        detectBottomWallCollision(ball)
    })
}

function stopBall() {
    table.userData.balls.forEach((ball) => {
        if (Math.abs(ball.userData.speed.x) <= stopVelocity) {
            ball.userData.speed.x = 0
        }

        if (Math.abs(ball.userData.speed.z) <= stopVelocity) {
            ball.userData.speed.z = 0
        }
    })
}

function reduceSpeed() {
    table.userData.balls.forEach((ball) => {
        if (Math.abs(ball.userData.speed.x) > 0) {
            ball.userData.speed.x = calculateVelocity(ball.userData.speed.x, ball.userData.acceleration.x, deltaFrameTime)
        }

        if (Math.abs(ball.userData.speed.z) > 0) {
            ball.userData.speed.z = calculateVelocity(ball.userData.speed.z, ball.userData.acceleration.z, deltaFrameTime)
        }
    })
}

function updateBallsPositions() {
    table.userData.balls.forEach((ball) => {
        ball.position.x = calculateNextPosition(ball.position.x, ball.userData.speed.x, ball.userData.acceleration.x, deltaFrameTime)
        ball.position.z = calculateNextPosition(ball.position.z, ball.userData.speed.z, ball.userData.acceleration.z, deltaFrameTime)
    })
}

function calculateVelocity(v, a, deltaT) {
    return v + a * deltaT
}

function calculateNextPosition(x, v, a, deltaT) {
    return x + v * deltaT + 0.5 * a * (deltaT ** 2)
}

// animates the scene
function animate() {
    prevFrameTime = nextFrameTime
    nextFrameTime = new Date()

    if (prevFrameTime != 0) {
        deltaFrameTime = (nextFrameTime - prevFrameTime) / 1000
    }

    
    detectWallCollision()
    
    reduceSpeed()
    stopBall()
    
    updateBallsPositions()
    updateCameraPosition(camera)

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

    /*actualiza controller
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
    */
}
