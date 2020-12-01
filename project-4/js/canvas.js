'use strict'

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let pLight, dirLight, scene, renderer, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0
let controls, speed = 0
let pauseScreenBox, ball, inPause = false, wireframe = false, initMaterialName = "phong"

const background = '#000000'

const pauseScreenProperties = {
    textureUrl: 'assets/pause_texture.jpg',
    length: 10,
    height: 10,
    width: 10,
    x: 0,
    y: 50,
    z: 0
}

const groundProperties = {
    side: 30,
    height: 1,
    repeatSquares: 10,
    color: "#ffffff",
    textureUrl: 'assets/grass_pattern.png',
    bumpUrl: 'assets/grass_bump.jpg',
    ballProperties: {
        radius: 0.5,
        rotating: true,
        velocity: 1,
        segments: 32,
        repeatSquares: 1,
        color: '#ffffff',
        textureUrl: 'assets/golfball.jpg',
        bumpUrl: 'assets/golfball.jpg',
        bumpScale: 0.1,
        specular: '#ffffff',
        shininess: 100,
    },
    golfFlagProperties: {
        radius: 0.1,
        height: 7,
        rotationVelocity: 3, 
        flagPoleProperties: {
            color: "#ffffff",
            textureUrl: 'assets/flagpole_texture.png',
            bumpUrl: 'assets/flagpole_texture.png',
        },
        flagProperties: {
            width: 2,
            color: "#ffffff",
            textureUrl: 'assets/flag_texture.jpg',
            bumpUrl: 'assets/flag_texture.jpg',
        },
    }
}

const initialPositions = {
    flagx: groundProperties.side / 3,
    flagy: -groundProperties.height/2 + groundProperties.height + groundProperties.golfFlagProperties.height/2,
    flagz: -groundProperties.side / 4,
    ballx: 0,
    bally: groundProperties.height/2 + groundProperties.ballProperties.radius,
    ballz: 0
}

// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

function createPauseScreen(obj, x, y, z) {
    const geometry = new THREE.BoxGeometry(pauseScreenProperties.width, pauseScreenProperties.height, pauseScreenProperties.lenght)

    const material = new THREE.MeshBasicMaterial(
        {
            map: new THREE.TextureLoader().load(pauseScreenProperties.textureUrl),
            side: THREE.DoubleSide,
        }
    )

    const mesh = new THREE.Mesh(geometry, material)
    
    mesh.position.set(x, y, z)
    obj.add(mesh)
}

function createBall(obj, x, y, z) {
    const ball = new THREE.Object3D()

    ball.userData = {
        rotating: groundProperties.ballProperties.rotating
    }

    geometry = new THREE.SphereGeometry(groundProperties.ballProperties.radius,groundProperties.ballProperties.segments,groundProperties.ballProperties.segments);

    let texture = loadTexture(groundProperties.ballProperties.textureUrl)

    let bump = loadTexture(groundProperties.ballProperties.bumpUrl)

    const phongMaterial = new THREE.MeshPhongMaterial({
        name: "phong",
        wireframe: wireframe,
        map: texture,
        bumpMap: bump,
        bumpScale: groundProperties.ballProperties.bumpScale,
        specular: groundProperties.ballProperties.specular,
        shininess: groundProperties.ballProperties.shininess,
    })

    const basicMaterial = new THREE.MeshBasicMaterial({
        name: "basic",
        wireframe: wireframe,
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
        wireframe: wireframe,
        map: texture,
        bumpMap: bump,
    })

    let basicMaterial = new THREE.MeshBasicMaterial({ 
        name: "basic",
        wireframe: wireframe,
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
        wireframe: wireframe,
        map: texture,
        bumpMap: bump,
        side: THREE.DoubleSide,
    })

    basicMaterial = new THREE.MeshBasicMaterial({
        name: "basic",
        wireframe: wireframe,
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
        wireframe: wireframe,
        map: texture,
        bumpMap: bump,
    })

    const basicMaterial = new THREE.MeshBasicMaterial({
        color: groundProperties.color, 
        name: "basic",
        wireframe: wireframe,
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

    ball = createBall(ground, x, initialPositions.bally, z)

    createFlag(ground, initialPositions.flagx, initialPositions.flagy, initialPositions.flagz)

    obj.add(ground)
}

// creates the scene object
function createScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(background)

    createGround(scene, initialPositions.ballx, -groundProperties.height/2, initialPositions.ballz)

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
        x: groundProperties.side / 8,
    }

    const newX = Math.sin(speed) * maxPositions.x
    
    const newZ = calculateParabolicMovement(newX, 0.5, 0)
    
    const vx = (newX - ball.position.x) / deltaFrameTime
    const vz = (newZ - ball.position.z) / deltaFrameTime
    
    if (newZ <= groundProperties.side / 2) {
        ball.position.x = newX
        ball.position.z = newZ
    }
        
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

    if (!inPause) {
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

    //Criar PauseScreenBox
    pauseScreenBox = new THREE.Object3D()
    createPauseScreen(pauseScreenBox, pauseScreenProperties.x, pauseScreenProperties.y, pauseScreenProperties.z)

    //Cameras
    createPerspectiveCamera()
    createOrthographicCamera(pauseScreenProperties.x, pauseScreenProperties.y, pauseScreenProperties.z, pauseScreenProperties.x, pauseScreenProperties.y, pauseScreenProperties.z)
    camera = perspectiveCamera

    //Cameras
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    render()

    
    

    //criar luz direcional
    dirLight = new DirLight(groundProperties.side, groundProperties.side, groundProperties.side, scene)

    scene.add(dirLight)

    //criar luz pontual
    pLight = new PLight(-groundProperties.side / 4, groundProperties.ballProperties.radius, groundProperties.side / 4, scene)
    scene.add(pLight)

    createSkybox(scene, 0, 0, 0)

    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', keysPressed)
    window.addEventListener('keyup', keysReleased)
}

function switchWireframes(obj) {
    if (obj == undefined) return

    if (obj.material) {
        if (obj.material.name == "phong" || obj.material.name == "basic") {
            obj.material.wireframe = !obj.material.wireframe
        }
    }
    for (let i = 0; i < obj.children.length; i++) {
        switchWireframes(obj.children[i])
    }
    return 
}

function resetWireframes(obj) {
    if (obj == undefined) return

    if (obj.material) {
        if (obj.material.name == "phong" || obj.material.name == "basic") {
            obj.material.wireframe = wireframe
        }
    }
    for (let i = 0; i < obj.children.length; i++) {
        resetWireframes(obj.children[i])
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

function resetIllumination(obj) {
    if (obj == undefined) return

    if (obj.type == "Mesh") {
        if (obj.material.name == "basic") {
            obj.material = obj.userData[initMaterialName]
        }
    }

    if (obj.type == "DirectionalLight" || obj.type == "PointLight") {
        if (!obj.active) {
            obj.turnLightOnorOff()
        }
    }
    for (let i = 0; i < obj.children.length; i++) {
        resetIllumination(obj.children[i])
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
    if (inPause) {
        controls.enabled = true;
        scene.remove(pauseScreenBox)
        camera = perspectiveCamera
        inPause = false
    }
    else {
        controls.enabled = false;
        scene.add(pauseScreenBox)
        camera = orthoCamera
        inPause = true
    }

}

function resetScene() {
    if (inPause) {
        controls.enabled = true;
        scene.remove(pauseScreenBox)
        camera = perspectiveCamera
        prevFrameTime = 0
        resetBallAndFlag()
        updateCameraPosition(perspectiveCamera, groundProperties.side / 2, 15, groundProperties.side / 2, scene.position)
        inPause = false
        resetWireframes(scene)
        resetIllumination(scene)
    }
}

function resetBallAndFlag() {
    scene.children.forEach(element => {
        if (element.name == "ground") {
            element.children.forEach(element => {
                if (element.name == "ball") {
                    console.log("ball")
                    element.position.x = initialPositions.ballx
                    element.position.y = initialPositions.bally
                    element.position.z = initialPositions.ballz
                    element.userData.rotating = groundProperties.ballProperties.rotating
                }
                else if (element.name == "golfFlag") {
                    console.log("flag")
                    element.position.x = initialPositions.flagx
                    element.position.y = initialPositions.flagy
                    element.position.z = initialPositions.flagz
                    element.rotation.set(0,0,0)
                }
            })
        }
    })
    speed = 0
}