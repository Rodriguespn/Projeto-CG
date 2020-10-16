let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, camera, renderer, geometry, material, mesh, table

const background = '#d0e7e5'

const tableProperties = {
    color: '#0a6c03',
    width: 100,
    length: 40,
    height: 2, // A altura H das paredes da mesa deve ser tal que não permita que as bolas caiam para fora da mesa
    initX: 0,
    initY: 0,
    initZ: 0
}

const frontWallProperties = {
    color: '#8b4513',
    width: tableProperties.width, height: tableProperties.length * 0.1,
    length: tableProperties.height
}

const sideWallProperties = {
    color: frontWallProperties.color,
    width: tableProperties.length, height: frontWallProperties.height, 
    length: frontWallProperties.length
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
    x: tableProperties.width, 
    y: tableProperties.width * 1.5, 
    z: tableProperties.width
}


// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

// updates the position of the orthogonal camera
function updateCameraPosition() {
    camera.position.x = cameraProperties.x
    camera.position.y = cameraProperties.y
    camera.position.z = cameraProperties.z
    camera.lookAt(scene.position)
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

function createTable(x, y, z) {
    const table = new THREE.Object3D()

    material = new THREE.MeshBasicMaterial({ color: tableProperties.color, wireframe: true })

    addTableTop(table, 0, 0, 0)
    addTableFrontWall(table, 0, tableProperties.height, tableProperties.length / 2 - frontWallProperties.length / 2)
    addTableFrontWall(table, 0, tableProperties.height, -(tableProperties.length / 2 - frontWallProperties.length / 2))
    addTableSideWall(table, tableProperties.width / 2 - frontWallProperties.length / 2, tableProperties.height, 0)
    addTableSideWall(table, -(tableProperties.width / 2 - frontWallProperties.length / 2), tableProperties.height, 0)

    createBall(table, 0, tableProperties.height / 2 + ballProperties.radius, 0)

    scene.add(table)

    table.position.x = x
    table.position.y = y
    table.position.z = z
}

// creates the camera object
function createCamera() {
    /* NAO APAGAR!!!!!! */ 
    //camera = new THREE.OrthographicCamera(cameraProperties.cameraLeft, cameraProperties.cameraRight, cameraProperties.cameraTop, cameraProperties.cameraBottom, 1, 1000)

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 1000)

    updateCameraPosition()
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
            cameraProperties.x = tableProperties.width
            cameraProperties.y = tableProperties.width * 1.5
            cameraProperties.z = tableProperties.width
            break;
            
        case '2':
            cameraProperties.x = tableProperties.width * 2
            cameraProperties.y = tableProperties.width
            cameraProperties.z = 0
            break;
                
        case '3':
            cameraProperties.x = 0
            cameraProperties.y = tableProperties.width
            cameraProperties.z = tableProperties.width * 2
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

//Guarda as teclas que foram premidas
const controller = {

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
