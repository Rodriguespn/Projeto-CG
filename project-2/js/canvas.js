let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let scene, camera, orthocamera, perspective1, perspective2, renderer, geometry, material, mesh, table, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0, selectedCue 

const background = '#404040'
const numberOfBalls = 0
const frictionCoefficient = 0.1 // ranges between [0,1]
const gravity = 9.8
const fallLimit = -200

/*
    Vicente: Rodar Tacos / Tacada / Camara q segue a bola
    Pedro: Bola-Bola / Bola-Parede
    João: Queda das bolas no infinito 
*/

const tableProperties = {
    color: '#0a6c03',
    width: 200,
    length: 120,
    height: 5,
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
    color: 0xffa54f,
    selectedColor: 0xfc4903, 
    height: tableProperties.width / 3,
    radius: 2,
    rotationAngle: Math.PI / 180,
    maxAngle: Math.PI / 3,
    minAngle: -Math.PI / 3
}

const ballProperties = {
    color: '#ffffff',
    radius: frontWallProperties.height / 4,
    mass: 1
}

const holeProperties = {
    color: '#000000',
    radius: ballProperties.radius * 3,
    height: tableProperties.height + 0.001
}

const initialVelocity = {
    x: 100,
    y: 0,
    z: 100
}

const acceleration = {
    x: initialVelocity.x * frictionCoefficient,
    y: 0,
    z: initialVelocity.z * frictionCoefficient,   
}

// all the camera properties
const orthogonalCameraProperties = {
    cameraLeft: -tableProperties.width,
    cameraRight: tableProperties.width,
    cameraTop: tableProperties.width,
    cameraBottom: -tableProperties.width,
    x: 0,
    y: tableProperties.width*1.2,
    z: 0
}

const perspectiveCameraProperties = {
    cameraLeft: -tableProperties.width,
    cameraRight: tableProperties.width,
    cameraTop: tableProperties.width,
    cameraBottom: -tableProperties.width,
    x: 0,
    y: tableProperties.width*1.2,
    z: 0
}


// draws the object on the canvas
function render() {
    renderer.render(scene, camera)
}

// updates the position of the orthogonal camera
function updateCameraPosition(obj, x, y, z, lookAt) {
    obj.position.x = x
    obj.position.y = y
    obj.position.z = z
    obj.lookAt(lookAt)
}

function randomFromInterval(min, max) { // min and max included 
    return Math.random() * (max - min + 1) + min
}

function randomIntFromInterval(min, max) {
    return Math.floor(randomFromInterval(min, max))
}

function createBall(obj, x, y, z, vx, vy, vz, ax, ay, az) {
    ball = new THREE.Object3D()

    ball.userData = { radius: ballProperties.radius, mass: ballProperties.mass, velocity: {x: vx, y: vy, z: vz }, acceleration: { x: ax, y: ay, z: az } }

    material = new THREE.MeshBasicMaterial({ color: ballProperties.color, wireframe: true })

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
    let x = randomIntFromInterval(-(tableProperties.width / 2 - sideWallProperties.length*2-ballProperties.radius*2), tableProperties.width / 2 - sideWallProperties.length*2-ballProperties.radius*2)
    const y = tableProperties.height / 2 + ballProperties.radius
    let z = randomIntFromInterval(-(tableProperties.length / 2 - frontWallProperties.length*2-ballProperties.radius*2), tableProperties.length / 2 - frontWallProperties.length*2-ballProperties.radius*2)

    const numbOfBalls = table.userData.balls.length
    for (let i = 0; i < numbOfBalls; i++) {
        let ball = table.userData.balls[i]
        if (detectCollision(x, y, z, ball.position.x,ball.position.y, ball.position.z, ballProperties.radius, ball.userData.radius)) {
            x = randomIntFromInterval(-(tableProperties.width / 2 - sideWallProperties.length*2-ballProperties.radius*2), tableProperties.width / 2 - sideWallProperties.length*2-ballProperties.radius*2)

            z = randomIntFromInterval(-(tableProperties.length / 2 - frontWallProperties.length*2-ballProperties.radius*2), tableProperties.length / 2 - frontWallProperties.length*2-ballProperties.radius*2)

            i = -1 // starts the cycle all over again
        }
    }
    
    const vx = randomFromInterval(-initialVelocity.x, initialVelocity.x)
    const vy = 0
    const vz = randomFromInterval(-initialVelocity.z, initialVelocity.z)

    const ax = -1 * getDirection(vx) * acceleration.x
    const ay = 0
    const az = -1 * getDirection(vz) * acceleration.z

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

function createHole(obj, x, y, z) {
    hole = new THREE.Object3D()

    hole.userData = { radius: holeProperties.radius }
    hole.name = "hole"

    geometry = new THREE.CylinderGeometry(holeProperties.radius, holeProperties.radius, holeProperties.height)

    material = new THREE.MeshBasicMaterial({ color: holeProperties.color, wireframe: true})
    mesh = new THREE.Mesh(geometry, material)

    hole.add(mesh) 
    hole.position.set(x, y, z)   
    obj.add(hole)
    obj.userData.holes.push(hole)
}

// creates a circle at the (x,y,z) position
function createCue(obj, x, y, z, { rotX, rotY, rotZ }, name) {

    geometry = new THREE.CylinderGeometry(cueProperties.radius, cueProperties.radius/4, cueProperties.height);

    material = new THREE.MeshBasicMaterial({ color: cueProperties.color, wireframe: true })
    const cue = new THREE.Mesh(geometry, material)

    cue.userData = { angle: 0 }
    cue.name = name

    cue.position.set(x, y, z)
    cue.rotation.x += rotX
    cue.rotation.y += rotY
    cue.rotation.z += rotZ

    obj.add(cue)

    obj.userData.cues.push(cue)

    return cue
}

function createTable(x, y, z) {
    table = new THREE.Object3D()

    material = new THREE.MeshBasicMaterial({ color: tableProperties.color, wireframe: true })

    table.userData = { balls: [], cues: [], holes: [] }

    addTableTop(table, 0, 0, 0)
    addTableFrontWall(table, 0, frontWallProperties.height / 2 + tableProperties.height / 2, tableProperties.length / 2 - frontWallProperties.length / 2)
    addTableFrontWall(table, 0, frontWallProperties.height / 2 + tableProperties.height / 2, -(tableProperties.length / 2 - frontWallProperties.length / 2))
    addTableSideWall(table, tableProperties.width / 2 - frontWallProperties.length / 2, frontWallProperties.height/2 + tableProperties.height / 2, 0)
    addTableSideWall(table, -(tableProperties.width / 2 - frontWallProperties.length / 2), frontWallProperties.height/2 + tableProperties.height / 2, 0)

    let rotation = {rotX: Math.PI / 2, rotY: 0, rotZ: 0}
    createCue(table, tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, tableProperties.length / 2 + cueProperties.height/2, rotation, "frontCue")
    createCue(table, -tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, tableProperties.length / 2 + cueProperties.height/2, rotation, "frontCue")

    rotation = {rotX: - Math.PI / 2, rotY: 0, rotZ: 0}
    createCue(table, -tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, -(tableProperties.length / 2 + cueProperties.height/2), rotation, "frontCue")
    createCue(table, tableProperties.width / 4, tableProperties.height / 2 + cueProperties.radius, -(tableProperties.length / 2 + cueProperties.height/2), rotation, "frontCue")

    rotation = {rotX: 0, rotY: 0, rotZ: -Math.PI / 2}
    createCue(table, tableProperties.width / 2 + cueProperties.height / 2, tableProperties.height / 2 + ballProperties.radius, 0, rotation, "sideCue")
    
    rotation = {rotX: 0, rotY: 0, rotZ: Math.PI / 2}
    createCue(table, -(tableProperties.width / 2 + cueProperties.height / 2), tableProperties.height / 2 + ballProperties.radius, 0, rotation, "sideCue") 

    //create holes on the table
    createHole(table, tableProperties.width/2 -(sideWallProperties.length + holeProperties.radius), 0, tableProperties.length/2 -(frontWallProperties.length + holeProperties.radius))
    createHole(table, tableProperties.width/2 - (sideWallProperties.length + holeProperties.radius), 0, -(tableProperties.length/2 -(frontWallProperties.length + holeProperties.radius)))
    createHole(table, -(tableProperties.width/2 - (sideWallProperties.length + holeProperties.radius)), 0, tableProperties.length/2 - (frontWallProperties.length + holeProperties.radius))
    createHole(table, -(tableProperties.width/2 - (sideWallProperties.length + holeProperties.radius)), 0, -(tableProperties.length/2 - (frontWallProperties.length + holeProperties.radius)))
    createHole(table, 0, 0, -(tableProperties.length/2 - (frontWallProperties.length + holeProperties.radius)))
    createHole(table, 0, 0, tableProperties.length/2 - (frontWallProperties.length + holeProperties.radius))


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
    orthocamera = new THREE.OrthographicCamera(-tableProperties.width, tableProperties.width, tableProperties.length*1.5,
         -tableProperties.length*1.5, 1, tableProperties.width*3)

    updateCameraPosition(orthocamera, orthogonalCameraProperties.x, orthogonalCameraProperties.y, orthogonalCameraProperties.z, scene.position)
}

function createPerspectiveCameras() {
    perspective1 = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, tableProperties.width*3)
    perspective2 = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, tableProperties.width*3)

    perspective2.userData = { ball: undefined }

    updateCameraPosition(perspective1, tableProperties.width * 0.8, tableProperties.width * 1.3, tableProperties.length *1.5, scene.position)
    updateCameraPosition(perspective2, perspectiveCameraProperties.x, tableProperties.height+ballProperties.radius, perspectiveCameraProperties.z, scene.position)
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
            orthogonalCameraProperties.x = 0
            orthogonalCameraProperties.y = tableProperties.width * 1.5
            orthogonalCameraProperties.z = 0
            break;
            
        case '2':
            camera = perspective1
            perspectiveCameraProperties.x = tableProperties.width * 0.8
            perspectiveCameraProperties.y = tableProperties.width * 1.3
            perspectiveCameraProperties.z = tableProperties.length *1.5
            break;
                
        case '3':
            camera = perspective2
            break;

        case '4':
            if (selectedCue) {
                selectedCue.material.color.setHex(cueProperties.color)
            }
            selectedCue = table.userData.cues[0]
            selectedCue.material.color.setHex(cueProperties.selectedColor)
            break;

        case '5':
            if (selectedCue) {
                selectedCue.material.color.setHex(cueProperties.color)
            }
            selectedCue = table.userData.cues[1]
            selectedCue.material.color.setHex(cueProperties.selectedColor)
            break;

        case '6':
            if (selectedCue) {
                selectedCue.material.color.setHex(cueProperties.color)
            }
            selectedCue = table.userData.cues[2]
            selectedCue.material.color.setHex(cueProperties.selectedColor)
            break;

        case '7':
            if (selectedCue) {
                selectedCue.material.color.setHex(cueProperties.color)
            }
            selectedCue = table.userData.cues[3]
            selectedCue.material.color.setHex(cueProperties.selectedColor)
            break;

        case '8':
            if (selectedCue) {
                selectedCue.material.color.setHex(cueProperties.color)
            }
            selectedCue = table.userData.cues[4]
            selectedCue.material.color.setHex(cueProperties.selectedColor)
            break;

        case '9':
            if (selectedCue) {
                selectedCue.material.color.setHex(cueProperties.color)
            }
            selectedCue = table.userData.cues[5]
            selectedCue.material.color.setHex(cueProperties.selectedColor)
            break;

        case '0':
            scene.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe
                }
            })
            break;

        case 'ArrowLeft':
            console.log("Left pressed")
            if (selectedCue && selectedCue.userData.angle >= cueProperties.minAngle) {
                console.log(selectedCue.userData.angle)
                console.log(cueProperties.minAngle)
                if (selectedCue.name === 'frontCue') {
                    selectedCue.rotation.z -= cueProperties.rotationAngle
                } else if (selectedCue.name === 'sideCue') {
                    selectedCue.rotation.y += cueProperties.rotationAngle
                }
                selectedCue.userData.angle -= cueProperties.rotationAngle
            }
            break;

        case 'ArrowRight':
            console.log("Right pressed")
            if (selectedCue && selectedCue.userData.angle <= cueProperties.maxAngle) {
                console.log(selectedCue.userData.angle)
                console.log(cueProperties.maxAngle)
                if (selectedCue.name === 'frontCue') {
                    selectedCue.rotation.z += cueProperties.rotationAngle
                } else if (selectedCue.name === 'sideCue') {
                    selectedCue.rotation.y -= cueProperties.rotationAngle
                }
                selectedCue.userData.angle += cueProperties.rotationAngle
            }
            break;

        case 'Spacebar':
        case ' ':
            console.log("Space pressed")
            if (selectedCue) {
                const x = selectedCue.position.x
                const y = selectedCue.position.y
                const z = selectedCue.position.z

                let v
                
                if (selectedCue.name === 'frontCue') {
                    v = rotate({ x: 0, z: initialVelocity.z }, -selectedCue.userData.angle)

                } else if (selectedCue.name === 'sideCue') {
                    v = rotate({ x: initialVelocity.x, z: 0 }, -selectedCue.userData.angle)
                }
                
                const ax = -1 * getDirection(v.x) * acceleration.x
                const ay = 0
                const az = -1 * getDirection(v.z) * acceleration.z

                const ball = createBall(table, x, y, z, v.x, 0, v.z, ax, ay, az)

                perspective2.userData.ball = ball
                updateCameraPosition(perspective2, perspectiveCameraProperties.x, tableProperties.height+ballProperties.radius, perspectiveCameraProperties.z, scene.position)
            }
            break;
    }
}

function detectHoleCollision(ball) {
    table.userData.holes.forEach((hole) => {
        if (detectCollision(ball.position.x, 0, ball.position.z, hole.position.x, 0, hole.position.z, 0, holeProperties.radius)) {
            ball.userData.acceleration.y = -gravity
            ball.userData.velocity.x *= 0.1
            ball.userData.velocity.y = calculateVelocity(ball.userData.velocity.y, ball.userData.acceleration.y, deltaFrameTime)
            ball.userData.velocity.z *= 0.1
        }
    })
}

function detectRightWallCollision(ball) {
    const radius = ballProperties.radius
    const border = tableProperties.width/2 - (radius+sideWallProperties.length)
    if (ball.position.x > border) {
        ball.position.x = border
        ball.userData.velocity.x = -ball.userData.velocity.x
        ball.userData.acceleration.x = -ball.userData.acceleration.x
    }
}

function detectLeftWallCollision(ball) {
    const radius = ballProperties.radius
    const border = -(tableProperties.width/2 - (radius+sideWallProperties.length))
    if (ball.position.x < border) {
        ball.position.x = border
        ball.userData.velocity.x = -ball.userData.velocity.x
        ball.userData.acceleration.x = -ball.userData.acceleration.x
    }
}

function detectTopWallCollision(ball) {
    const radius = ballProperties.radius
    const border = tableProperties.length / 2 - (radius+frontWallProperties.length)
    if (ball.position.z > border) {
        ball.position.z = border
        ball.userData.velocity.z = -ball.userData.velocity.z
        ball.userData.acceleration.z = -ball.userData.acceleration.z
    }
}

function detectBottomWallCollision(ball) {
    const radius = ballProperties.radius
    const border = -(tableProperties.length/2 - (radius+frontWallProperties.length))
    if (ball.position.z < border) {
        ball.position.z = border
        ball.userData.velocity.z = -ball.userData.velocity.z
        ball.userData.acceleration.z = -ball.userData.acceleration.z
    }
}

function detectWallCollision() {
    table.userData.balls.forEach((ball) => {
        detectRightWallCollision(ball)
        detectLeftWallCollision(ball)
        detectTopWallCollision(ball)
        detectBottomWallCollision(ball)
        detectHoleCollision(ball)
    })
}

function getDirection(x) {
    if (Math.abs(x) > 0)
        return x / Math.abs(x)
    else
        return 0
}

function sameDirection(x1, x2) {
    const direction1 = getDirection(x1)
    const direction2 = getDirection(x2)
    return direction1 === direction2
}

function reduceSpeed() {
    table.userData.balls.forEach((ball) => {
        if (Math.abs(ball.userData.velocity.x) > 0) {
            ball.userData.velocity.x = calculateVelocity(ball.userData.velocity.x, ball.userData.acceleration.x, deltaFrameTime)
        }

        if (Math.abs(ball.userData.velocity.z) > 0) {
            ball.userData.velocity.z = calculateVelocity(ball.userData.velocity.z, ball.userData.acceleration.z, deltaFrameTime)
        }

        if (Math.round(Math.abs(ball.userData.velocity.x)) === 0) {
            ball.userData.velocity.x = 0
        }

        if (Math.round(Math.abs(ball.userData.velocity.z)) === 0) {
            ball.userData.velocity.z = 0
        }
    })
}

function updateBallsPositions() {
    table.userData.balls.forEach((ball) => {
        ball.position.x = calculateNextPosition(ball.position.x, ball.userData.velocity.x, ball.userData.acceleration.x, deltaFrameTime)

        ball.position.y = calculateNextPosition(ball.position.y, ball.userData.velocity.y, ball.userData.acceleration.y, deltaFrameTime)

        ball.position.z = calculateNextPosition(ball.position.z, ball.userData.velocity.z, ball.userData.acceleration.z, deltaFrameTime)

        console.log(ball.userData.velocity)
        console.log(ball.userData.acceleration)
    })
}

function calculateVelocity(v, a, deltaT) {
    return v + a * deltaT
}

function calculateNextPosition(x, v, a, deltaT) {
    if (Math.abs(v) > 0) { 
        return x + v * deltaT + 0.5 * a * (deltaT ** 2)
    } else {
        return x
    }
}

function detectCollision(x1, y1, z1, x2, y2, z2, radius1, radius2) {
    return getDistance(x1, y1, x2, y2) < radius1 + radius2 && getDistance(x1, z1, x2, z2) < radius1 + radius2
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.z * Math.sin(angle),
        z: velocity.x * Math.sin(angle) + velocity.z * Math.cos(angle),
    }

    return rotatedVelocities
}

function resolveBallCollision(ball1, ball2) {
    if (detectCollision(ball1.position.x, ball1.position.y, ball1.position.z, ball2.position.x, ball2.position.y,  ball2.position.z, ball1.userData.radius, ball2.userData.radius)) {

        const xVelocityDiff = ball1.userData.velocity.x - ball2.userData.velocity.x
        const zVelocityDiff = ball1.userData.velocity.z - ball2.userData.velocity.z

        const xBall1 = ball1.position.x, zBall1 = ball1.position.z
        const xBall2 = ball2.position.x, zBall2 = ball2.position.z

        const xDist = xBall2 - xBall1
        const zDist = zBall2 - zBall1

        // Prevents accidental overlap of balls
        if(xVelocityDiff * xDist + zVelocityDiff * zDist >= 0) {

            // Grab angle between the two colliding balls
            const angle = -Math.atan2(zBall2 - zBall1, xBall2 - xBall1)

            // Store mass in var for better readibility in collision equation
            const m1 = ball1.userData.mass
            const m2 = ball2.userData.mass

            // Velocity before equation
            const u1 = rotate(ball1.userData.velocity, angle)
            const u2 = rotate(ball2.userData.velocity, angle)

            // Final velocity after 1d collision equation
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), z: u1.z }
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), z: u2.z }

            // Final velocity after rotating axis, vack to original location
            const vFinal1 = rotate(v1, -angle)
            const vFinal2 = rotate(v2, -angle)

            // swap balls velocities for realistic bounce effect
            ball1.userData.velocity.x = vFinal1.x
            ball1.userData.velocity.z = vFinal1.z

            ball2.userData.velocity.x = vFinal2.x
            ball2.userData.velocity.z = vFinal2.z

            // adjusts the friction acceleration based on the new velocity value
            ball1.userData.acceleration.x = -1 * getDirection(vFinal1.x) * Math.abs(vFinal1.x) * frictionCoefficient
            ball1.userData.acceleration.z = -1 * getDirection(vFinal1.z) * Math.abs(vFinal1.z) * frictionCoefficient
        

            ball2.userData.acceleration.x = -1 * getDirection(vFinal2.x) * Math.abs(vFinal2.x) * frictionCoefficient
            ball2.userData.acceleration.z = -1 * getDirection(vFinal2.z) * Math.abs(vFinal2.z) * frictionCoefficient
        }
    }
}

function resolveAllBallsCollisions() {
    const numbOfBalls = table.userData.balls.length
    for (let i = 0; i < numbOfBalls; i++) {
        let ball1 = table.userData.balls[i]
        for (let j = 0; j < numbOfBalls; j++) {
            if (i === j) continue // same ball
            let ball2 = table.userData.balls[j]
            resolveBallCollision(ball1, ball2)
        }
    }
}

function getDistance(x1, y1, x2, y2) {
    const xDistance = x2 - x1
    const yDistance = y2 - y1

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

/*function removeFallenBall() {
    let removeIndexes = Array()
    for (let i = 0; i < table.userData.balls.length; i++) {
        if (table.userData.balls[i].position.y <= fallLimit) {
            removeIndex.push(i)
        }
    }
    for (let i = 0; i < removeIndexes.length; i++) {
        table.userData.balls.splice(removeIndexes[i], 1);
    }

    removeIndexes = Array()
    for (let i = 0; i < table.children.length; i++) {
        if (table.children[i].position.y <= fallLimit) {
            removeIndex.push(i)
        }
    }

    for (let i = 0; i < removeIndexes.length; i++) {
        table.children.splice(removeIndexes[i], 1);
    }
}*/

// animates the scene
function animate() {
    prevFrameTime = nextFrameTime
    nextFrameTime = new Date()

    if (prevFrameTime != 0) {
        deltaFrameTime = (nextFrameTime - prevFrameTime) / 1000
    }

    reduceSpeed()

    detectWallCollision()
    resolveAllBallsCollisions()
    //removeFallenBall()
    
    
    updateBallsPositions()

    if (camera === perspective2) {
        const cameraBall = camera.userData.ball
        if (cameraBall) {
            const x = calculateNextPosition(camera.position.x, cameraBall.userData.velocity.x, cameraBall.userData.acceleration.x, deltaFrameTime)
            const y = camera.userData.ball.position.y
            const z = calculateNextPosition(camera.position.z, cameraBall.userData.velocity.z, cameraBall.userData.acceleration.z, deltaFrameTime)

            updateCameraPosition(perspective2, x, y, z, cameraBall.position)
        }
    }

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
