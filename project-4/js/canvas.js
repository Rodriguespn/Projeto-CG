'use strict'

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let pLight, dirLight, scene, renderer, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0
let controls, angle = 0, speed = 0
let ball

const background = '#000000'

const groundProperties = {
    side: 20,
    height: 1,
    repeatSquares: 10,
    color: "#ffffff",
    textureUrl: 'assets/grass_pattern.png',
    bumpUrl: 'assets/grass_bump.jpg',
    wireframe: false,
    ballProperties: {
        radius: 0.5,
        velocity: 1,
        segments: 32,
        repeatSquares: 1,
        color: '#ffffff',
        textureUrl: 'assets/golfball.jpg',
        bumpUrl: 'assets/golfball.jpg',
        bumpScale: 0.1,
        wireframe: false,
        specular: '#ffffff',
        shininess: 100,
    },
    golfFlagProperties: {
        radius: 0.1,
        height: 7,
        wireframe: false,
        rotationVelocity: 3, 
        flagPoleProperties: {
            color: "#ffffff",
            textureUrl: 'assets/flagpole_texture.png',
            bumpUrl: '',
        },
        flagProperties: {
            width: 2,
            color: "#ffffff",
            textureUrl: 'assets/flag_texture.jpg',
            bumpUrl: '',
        },
    }
}

// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

function createBall(obj, x, y, z) {
    const ball = new THREE.Object3D()

    ball.userData = {
        rotating: true
    }

    geometry = new THREE.SphereGeometry(groundProperties.ballProperties.radius,groundProperties.ballProperties.segments,groundProperties.ballProperties.segments);

    let texture = loadTexture(groundProperties.ballProperties.textureUrl)

    let bump = loadTexture(groundProperties.ballProperties.bumpUrl)

    const phongMaterial = new THREE.MeshPhongMaterial({
        name: "phong",
        wireframe: groundProperties.ballProperties.wireframe,
        map: texture,
        bumpMap: bump,
        bumpScale: groundProperties.ballProperties.bumpScale,
        specular: groundProperties.ballProperties.specular,
        shininess: groundProperties.ballProperties.shininess,
    })

    const basicMaterial = new THREE.MeshBasicMaterial({
        name: "basic",
        wireframe: groundProperties.ballProperties.wireframe,
        map: texture,
    })

    const mesh = new THREE.Mesh(geometry, phongMaterial)
    
    mesh.castShadow = true
    mesh.receiveShadow = true
    
    mesh.userData = { 
        "phong": phongMaterial,
        "basic": basicMaterial
    }

    ball.add(mesh)
    ball.position.set(x, y, z)
    ball.name = "ball"
    obj.add(ball)

    return ball
}

function createFlag(obj, x, y, z) {
    const golfFlag = new THREE.Object3D()

    golfFlag.userData = {
        rotating: true,
    }

    const flagpole = new THREE.Object3D()

    geometry = new THREE.CylinderGeometry(groundProperties.golfFlagProperties.radius, groundProperties.golfFlagProperties.radius, groundProperties.golfFlagProperties.height);

    let texture = loadTexture(groundProperties.golfFlagProperties.flagPoleProperties.textureUrl)

    let bump = loadTexture(groundProperties.golfFlagProperties.flagPoleProperties.bumpUrl)

    let phongMaterial = new THREE.MeshPhongMaterial({ 
        name: "phong",
        wireframe: groundProperties.golfFlagProperties.wireframe,
        map: texture,
        bumpMap: bump,
    })

    let basicMaterial = new THREE.MeshBasicMaterial({ 
        name: "basic",
        wireframe: groundProperties.golfFlagProperties.wireframe,
        map: texture,
    })

    let mesh = new THREE.Mesh(geometry, phongMaterial)
    
    mesh.castShadow = true
    
    mesh.userData = { 
        "phong": phongMaterial,
        "basic": basicMaterial
    }

    flagpole.add(mesh)

    const flag = new THREE.Object3D()

    geometry = new THREE.PlaneGeometry(groundProperties.golfFlagProperties.flagProperties.width, groundProperties.golfFlagProperties.height*0.3, 10, 10);

    texture = loadTexture(groundProperties.golfFlagProperties.flagProperties.textureUrl)

    bump = loadTexture(groundProperties.golfFlagProperties.flagProperties.bumpUrl)

    phongMaterial = new THREE.MeshPhongMaterial({            
        name: "phong",
        wireframe: groundProperties.golfFlagProperties.wireframe,
        map: texture,
        bumpMap: bump,
        side: THREE.DoubleSide,
    })

    basicMaterial = new THREE.MeshBasicMaterial({
        name: "basic",
        wireframe: groundProperties.golfFlagProperties.wireframe,
        map: texture,
        side: THREE.DoubleSide,
    })

    mesh = new THREE.Mesh(geometry, phongMaterial)
    
    mesh.castShadow = true
    
    mesh.userData = { 
        "phong": phongMaterial,
        "basic": basicMaterial
    }

    flag.add(mesh)
    flag.position.set(
        groundProperties.golfFlagProperties.radius + groundProperties.golfFlagProperties.flagProperties.width/2, 
        groundProperties.golfFlagProperties.height / 2 - groundProperties.golfFlagProperties.flagProperties.width / 2, 
        0
    )
    
    flag.name = "flag"
    flagpole.name = "flagPole"

    golfFlag.add(flag)
    golfFlag.add(flagpole)
    golfFlag.position.set(x, y, z)
    golfFlag.name = "golfFlag"
    obj.add(golfFlag)
}

function createGround(obj, x, y, z) {
    const ground = new THREE.Object3D()

    geometry = new THREE.BoxGeometry( groundProperties.side, groundProperties.height, groundProperties.side);

    let texture = loadTexture(groundProperties.textureUrl)
    
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(groundProperties.repeatSquares, groundProperties.repeatSquares)

    let bump = loadTexture(groundProperties.bumpUrl)
    bump.wrapS = bump.wrapT = THREE.MirroredRepeatWrapping
    bump.repeat.set(groundProperties.repeatSquares, groundProperties.repeatSquares)

    const phongMaterial = new THREE.MeshPhongMaterial({           
        color: groundProperties.color, 
        name: "phong",
        wireframe: groundProperties.wireframe,
        map: texture,
        bumpMap: bump,
    })

    const basicMaterial = new THREE.MeshBasicMaterial({
        color: groundProperties.color, 
        name: "basic",
        wireframe: groundProperties.wireframe,
        map: texture,
    })

    const mesh = new THREE.Mesh(geometry, phongMaterial)
    
    mesh.receiveShadow = true
    
    mesh.userData = { 
        "phong": phongMaterial,
        "basic": basicMaterial
    }

    ground.add(mesh)
    ground.position.set(x, y, z)
    ground.name = "ground"

    ball = createBall(ground, x, groundProperties.height/2 + groundProperties.ballProperties.radius, z)

    createFlag(ground, groundProperties.side / 3, y + groundProperties.height + groundProperties.golfFlagProperties.height/2, -groundProperties.side / 4)

    obj.add(ground)
}

// creates the scene object
function createScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(background)

    createGround(scene, 0, -groundProperties.height/2, 0)
    scene.add(new THREE.AxesHelper(10))


    //teste
    console.log(scene)
}

function loadTexture(url) {
    return new THREE.TextureLoader().load(url, (texture) => {
            console.log(`Loaded texture ${url} successfully`)
        }, undefined, (err) => {
            console.error(`Failed to load texture ${url}\n${err}`)
    })
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

function rotateObject(element, angle) {
    const position = { 
        x: groundProperties.side/3, 
        y: groundProperties.height/2 + groundProperties.ballProperties.radius, 
        z: groundProperties.side/3
    }

    element.position.set(
        position.x * Math.cos(angle), 
        position.y, 
        position.z * Math.sin(angle)
    )
}

function moveGolfFlag(golfFlag) {
    golfFlag.rotation.y += groundProperties.golfFlagProperties.rotationVelocity * deltaFrameTime
}

function moveBall(ball) {
    speed += groundProperties.ballProperties.velocity * deltaFrameTime
    const maxPositions = {
        x: groundProperties.side / 4,
    }

    const newX = Math.cos(speed) * maxPositions.x
    const newZ = calculateParabolicMovement(newX, 0.5, -groundProperties.side / 4)
    const vx = (newX - ball.position.x) / deltaFrameTime
    const vz = (newZ - ball.position.z) / deltaFrameTime
    
    ball.position.x = newX
    ball.position.z = newZ

    ball.rotation.x = vz
    ball.rotation.z = vx
}

function calculateAngularVelocity(linearVelocity) {
    return linearVelocity / (Math.PI * ballProperties.radius) * Math.PI
}

// y(x) = kx**2 + b

function calculateParabolicMovement(x, k, b) {
    return Math.pow(x, 2) * k + b
}

function getDirection(x) {
    if (Math.abs(x) > 0)
        return x / Math.abs(x)
    else
        return 0
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

    // teste rotacao da bola
    scene.children.forEach(element => {
        if (element.name == "ground") {
            element.children.forEach(element => {
                if (element.name == "ball") {
                    if (element.userData.rotating) {
                        moveBall(element)
                    } 
                }
                if (element.name == "golfFlag") {
                    if (element.userData.rotating) {
                        moveGolfFlag(element)
                    } 
                }
            })
        }
    })


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
    createOrthographicCamera(0, 50, 30)
    camera = perspectiveCamera

    //Cameras
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    render()

    //criar luz direcional
    dirLight = new DirLight(groundProperties.side, groundProperties.side, groundProperties.side, scene)

    scene.add(dirLight)

    let helper = new THREE.DirectionalLightHelper(dirLight, 5)
    scene.add(helper)

    let shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera)
    scene.add(shadowHelper)

    //criar luz pontual
    pLight = new PLight(-groundProperties.side / 4, groundProperties.ballProperties.radius, groundProperties.side / 4, scene)
    scene.add(pLight)

    helper = new THREE.DirectionalLightHelper(pLight, 5)
    scene.add(helper)

    createSkybox(scene, 0, 0, 0)

    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', keysPressed)
    window.addEventListener('keyup', keysReleased)
}

function switchWireframes(obj) {
    if (obj == undefined) return

    if (obj.material) {
        if (obj.material.name == "phong" || obj.material.name == "basic") {
            if (obj.material.wireframe) {
                obj.material.wireframe = false
            }
            else {
                obj.material.wireframe = true
            }
        }
    }
    for (let i = 0; i < obj.children.length; i++) {
        switchWireframes(obj.children[i])
    }
    return 
}

function illuminationCalculation(obj) {
    if (obj == undefined) return

    if (obj.type == "Mesh") {
        if (obj.material.name == "phong") {
            obj.material = obj.userData["basic"]
        }
        else if (obj.material.name == "basic") {
            obj.material = obj.userData["phong"]
        }
    }
    for (let i = 0; i < obj.children.length; i++) {
        illuminationCalculation(obj.children[i])
    }
    return 
}

function ballMovement() {
    if (scene.children[0].children[1].userData.rotating) {
        scene.children[0].children[1].userData.rotating = false
    }
    else {
        scene.children[0].children[1].userData.rotating = true
    }
}

function pauseScene() {
    
}

function resetScene() {

}