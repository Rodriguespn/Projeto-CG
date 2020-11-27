'use strict'

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let dirLight, scene, renderer, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0
let controls, angle = 0
let text

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
        radius: 1,
        segments: 32,
        repeatSquares: 1,
        color: '#ffffff',
        textureUrl: 'assets/golf_ball_texture.jpg',
        bumpUrl: 'assets/golf_ball_bump.jpg',
        wireframe: false,
    },
    golfFlagProperties: {
        radius: 0.1,
        height: 7,
        wireframe: false,
        flagPoleProperties: {
            color: "#ffffff",
            textureUrl: 'assets/flagpole_texture.png',
            bumpUrl: 'assets/grass_bump.jpg',
        },
        flagProperties: {
            width: 2,
            color: "#ffffff",
            textureUrl: 'assets/flag_texture.jpg',
            bumpUrl: 'assets/grass_bump.jpg',
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
    
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(groundProperties.ballProperties.repeatSquares, groundProperties.ballProperties.repeatSquares)

    let bump = loadTexture(groundProperties.ballProperties.bumpUrl)
    bump.wrapS = bump.wrapT = THREE.MirroredRepeatWrapping
    bump.repeat.set(groundProperties.repeatSquares, groundProperties.repeatSquares)

    const phongMaterial = new THREE.MeshPhongMaterial({           
        color: groundProperties.color, 
        name: "phong",
        wireframe: groundProperties.wireframe,
        map: texture,
        bumpMap: bump,
        side: THREE.DoubleSide,
    })

    const basicMaterial = new THREE.MeshBasicMaterial({
        color: groundProperties.color, 
        name: "basic",
        wireframe: groundProperties.wireframe,
        map: texture,
        side: THREE.DoubleSide,
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
        color: groundProperties.color, 
        name: "phong",
        wireframe: groundProperties.wireframe,
        map: texture,
        bumpMap: bump,
        side: THREE.DoubleSide,
    })

    let basicMaterial = new THREE.MeshBasicMaterial({
        color: groundProperties.color, 
        name: "basic",
        wireframe: groundProperties.wireframe,
        map: texture,
        side: THREE.DoubleSide,
    })

    let mesh = new THREE.Mesh(geometry, phongMaterial)
    
    mesh.castShadow = true
    
    mesh.userData = { 
        "phong": phongMaterial,
        "basic": basicMaterial
    }

    flagpole.add(mesh)

    const flag = new THREE.Object3D()

    geometry = new THREE.BoxGeometry(groundProperties.golfFlagProperties.flagProperties.width, groundProperties.golfFlagProperties.height*0.3, groundProperties.golfFlagProperties.radius);

    texture = loadTexture(groundProperties.golfFlagProperties.flagProperties.textureUrl)

    bump = loadTexture(groundProperties.golfFlagProperties.flagProperties.bumpUrl)

    phongMaterial = new THREE.MeshPhongMaterial({           
        color: groundProperties.color, 
        name: "phong",
        wireframe: groundProperties.wireframe,
        map: texture,
        bumpMap: bump,
        side: THREE.DoubleSide,
    })

    basicMaterial = new THREE.MeshBasicMaterial({
        color: groundProperties.color, 
        name: "basic",
        wireframe: groundProperties.wireframe,
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
        x + groundProperties.golfFlagProperties.flagProperties.width / 2 + groundProperties.golfFlagProperties.radius, 
        y - groundProperties.golfFlagProperties.height*0.3, 
        z
    )

    golfFlag.add(flag)
    golfFlag.add(flagpole)
    golfFlag.position.set(x, y, z)
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
        side: THREE.DoubleSide,
    })

    const basicMaterial = new THREE.MeshBasicMaterial({
        color: groundProperties.color, 
        name: "basic",
        wireframe: groundProperties.wireframe,
        map: texture,
        side: THREE.DoubleSide,
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

    createBall(ground, groundProperties.side/3, groundProperties.height/2 + groundProperties.ballProperties.radius, z)

    createFlag(ground, x, y + groundProperties.height + groundProperties.golfFlagProperties.height/2, z)

    obj.add(ground)
}

// creates the scene object
function createScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(background)

    createGround(scene, 0, -groundProperties.height/2, 0)
    scene.add(new THREE.AxesHelper(10))
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

// animates the scene
function animate() {
    prevFrameTime = nextFrameTime
    nextFrameTime = new Date()

    if (prevFrameTime != 0) {
        deltaFrameTime = (nextFrameTime - prevFrameTime) / 1000
    }

    // keysPressedChecker()
    
    controls.update()

    // teste rotacao da bola
    scene.children.forEach(element => {
        if (element.name == "ground") {
            element.children.forEach(element => {
                if (element.name == "ball") {
                    angle += Math.PI / 180
                    const position = { x: groundProperties.side/3, y: groundProperties.height/2 + groundProperties.ballProperties.radius, z: groundProperties.side/3}
                    element.position.set(position.x * Math.cos(angle), position.y, position.z * Math.sin(angle))
                }
            })
        }
    });
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
    
    // Teste
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    //criar luz direcional
    dirLight = new DirLight(40, 40, 60)

    window.addEventListener("resize", onResize)
    /*window.addEventListener('keydown', keysPressed)
    window.addEventListener('keyup', keysReleased)*/
}

// teste
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
