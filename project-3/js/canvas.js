let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let dirLight, scene, renderer, palanque, geometry, material, mesh, prevFrameTime = 0, nextFrameTime = 0, deltaFrameTime = 0

const background = '#000000'

const palanqueProperties = {
    radius: 170,
    height: 6,
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
    height: palanqueProperties.height * 15,
    wheelsProperties: {
        radius: palanqueProperties.radius * 0.15,
        height: palanqueProperties.height * 2,
        color: '#0c0b0c'
    },
    frontLightProperties: {
        color: "#ade6d8",
        height: palanqueProperties.height
    },
    backLightProperties: {
        color: "#8B0000",
        height: palanqueProperties.height*2
    },
    frontWindowProperties: {
        color: "#0c0c0c",
        offset: 10
    },
    backWindowProperties: {
        color: "#0c0c0c",
        offset: 20
    },
    sideWindowProperties: {
        color: "#0c0c0c",
        offset: 10
    },
    color: '#505050'
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

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.wheelsProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.wheelsProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.wheelsProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)

    phongMesh.rotation.set(Math.PI / 2, 0, 0)
    
    wheel.add(phongMesh)

    wheel.name = "wheel"

    obj.add(wheel)
}

function createWheelConnection(obj, x, y, z, { rotX, rotY, rotZ }) {
    const wheelConnection = new THREE.Object3D()

    geometry = new THREE.BoxGeometry(carProperties.wheelsProperties.radius / 2, carProperties.depth - carProperties.wheelsProperties.height, carProperties.wheelsProperties.radius / 2);

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)

    phongMesh.rotation.set(rotX, rotY, rotZ)
    
    wheelConnection.add(phongMesh)
    wheelConnection.name = "wheel connection"

    obj.add(wheelConnection)
}

function createMainWheelConnection(obj, x, y, z, { rotX, rotY, rotZ }) {
    const wheelConnection = new THREE.Object3D()

    geometry = new THREE.BoxGeometry(carProperties.wheelsProperties.radius / 2, carProperties.depth - carProperties.wheelsProperties.radius / 2, carProperties.wheelsProperties.radius / 2);

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)

    phongMesh.rotation.set(rotX, rotY, rotZ)
    
    wheelConnection.add(phongMesh)

    wheelConnection.name = "main wheel connection"

    obj.add(wheelConnection)
}

function createChassis(obj, x, y, z) {
    const chassis = new THREE.Object3D()
    const wheelsY = y - carProperties.height / 2 + carProperties.wheelsProperties.radius
    const wheelsXOffset = carProperties.width * 0.55
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

function createCarSide(obj, x, y, z, side) {
    const wall = new THREE.Object3D()

    const vz = carProperties.depth/2 * side
    const wheelsY = y - carProperties.height + carProperties.wheelsProperties.radius

    let vertices = [
        new THREE.Vector3( -carProperties.width*0.1,  carProperties.height, carProperties.depth*0.3 * side ), // 0
        new THREE.Vector3( carProperties.width,  carProperties.height*0.6, vz ), // 1
        new THREE.Vector3( carProperties.width,  wheelsY*0.4, vz ), // 2
        new THREE.Vector3( carProperties.width*0.7,  wheelsY, vz ), // 3
        new THREE.Vector3( carProperties.width*0.7, wheelsY*0.4, vz ), // 4
        new THREE.Vector3( carProperties.width*0.6,  wheelsY*0.1, vz ), // 5
        new THREE.Vector3( carProperties.width*0.5,  wheelsY*0.1, vz ), // 6
        new THREE.Vector3( carProperties.width*0.4,   wheelsY*0.4, vz ), // 7
        new THREE.Vector3( carProperties.width*0.4,  wheelsY, vz ), // 8
        new THREE.Vector3( -carProperties.width*0.4,  wheelsY, vz ), // 9
        new THREE.Vector3( -carProperties.width*0.4,  wheelsY*0.4, vz ), // 10
        new THREE.Vector3( -carProperties.width*0.5,  wheelsY*0.1, vz ), // 11
        new THREE.Vector3( -carProperties.width*0.6,  wheelsY*0.1, vz ), // 12
        new THREE.Vector3( -carProperties.width*0.7,  wheelsY*0.4, vz ), // 13
        new THREE.Vector3( -carProperties.width*0.7,  wheelsY, vz ), // 14
        new THREE.Vector3( -carProperties.width,  wheelsY, vz ), // 15
        new THREE.Vector3( -carProperties.width, carProperties.height*0.3, vz ), // 16
        new THREE.Vector3( -carProperties.width*0.65,  carProperties.height*0.6, vz ), // 17
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(
            vertice
        )
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 1, 17 ), 
        new THREE.Face3( 2, 3, 4 ), 
        new THREE.Face3( 1, 2, 4 ), 
        new THREE.Face3( 1, 4, 5 ), 
        new THREE.Face3( 1, 5, 6 ), 
        new THREE.Face3( 1, 6, 17 ), 
        new THREE.Face3( 6, 11, 17 ), 
        new THREE.Face3( 7, 8, 9 ), 
        new THREE.Face3( 6, 7, 10 ), 
        new THREE.Face3( 7, 9, 10 ), 
        new THREE.Face3( 6, 10, 11 ), 
        new THREE.Face3( 11, 12, 17 ), 
        new THREE.Face3( 12, 13, 17 ), 
        new THREE.Face3( 13, 16, 17 ), 
        new THREE.Face3( 13, 15, 16 ), 
        new THREE.Face3( 13, 14, 15 ));

    geometry.computeFaceNormals()
    geometry.computeVertexNormals()

    geometry.faces.forEach(vertice => {
        vertice.color = carProperties.color
    })

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)
    
    wall.add(phongMesh)

    // draw window
    vertices = [
        new THREE.Vector3( -carProperties.width*0.1,  carProperties.height, (carProperties.depth*0.3+1) * side ), // 0
        new THREE.Vector3( carProperties.width - carProperties.sideWindowProperties.offset*7,  carProperties.height*0.6, vz +1 ), // 1
        new THREE.Vector3( -carProperties.width*0.65 + carProperties.sideWindowProperties.offset,  carProperties.height*0.6, vz + 1 ), // 17
        new THREE.Vector3( carProperties.width - carProperties.sideWindowProperties.offset * 7,  carProperties.height*0.6 + carProperties.sideWindowProperties.offset, vz + 1 ), // 1'
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(vertice)
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 2, 3), 
        new THREE.Face3( 3, 2, 1),
    );

    geometry.computeVertexNormals()
    geometry.computeFaceNormals()

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)

    phongMesh.receiveShadow = true

    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)

    wall.add(phongMesh)

    obj.add(wall)
}

function createCarFront(obj, x, y, z) {
    const wall = new THREE.Object3D()

    const vz = carProperties.depth/2
    const wheelsY = y - carProperties.height + carProperties.wheelsProperties.radius

    let vertices = [
        new THREE.Vector3( -carProperties.width*0.1,  carProperties.height, carProperties.depth*0.3), // 0
        new THREE.Vector3( -carProperties.width*0.1,  carProperties.height, -carProperties.depth*0.3), // 21
        new THREE.Vector3( -carProperties.width,  wheelsY, vz ), // 15
        new THREE.Vector3( -carProperties.width,  wheelsY, -vz ), // 20
        new THREE.Vector3( -carProperties.width, carProperties.height*0.3, vz ), // 16
        new THREE.Vector3( -carProperties.width, carProperties.height*0.3, -vz ), // 19
        new THREE.Vector3( -carProperties.width*0.65,  carProperties.height*0.6, vz ), // 17
        new THREE.Vector3( -carProperties.width*0.65,  carProperties.height*0.6, -vz ), // 18
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(
            vertice
        )
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 6, 7), 
        new THREE.Face3( 7, 1, 0), 
        new THREE.Face3( 4, 5, 6), 
        new THREE.Face3( 7, 6, 5), 
        new THREE.Face3( 2, 3, 4),
        new THREE.Face3( 5, 4, 3), 
    );

    geometry.computeVertexNormals()
    geometry.computeFaceNormals()

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)
    
    phongMesh.position.set(x, y, z)
    
    wall.add(phongMesh)

    const offset = 10
    // draw light
    vertices = [
        new THREE.Vector3( -carProperties.width-1, carProperties.height*0.3, vz - offset ), // 16
        new THREE.Vector3( -carProperties.width-1, carProperties.height*0.3, -vz + offset), // 19
        new THREE.Vector3( -carProperties.width-1, carProperties.height*0.3 - carProperties.frontLightProperties.height, vz - offset ), // 16'
        new THREE.Vector3( -carProperties.width-1, carProperties.height*0.3- carProperties.frontLightProperties.height, -vz + offset), // 19'
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(vertice)
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 1, 2), 
        new THREE.Face3( 3, 2, 1),
    );
    
    geometry.computeVertexNormals()
    geometry.computeFaceNormals()

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.frontLightProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.frontLightProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.frontLightProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)
    
    wall.add(phongMesh)

    // draw window
    vertices = [
        new THREE.Vector3( -carProperties.width*0.1 - 1,  carProperties.height, carProperties.depth*0.3  - carProperties.frontWindowProperties.offset), // 0
        new THREE.Vector3( -carProperties.width*0.1 - 1,  carProperties.height, -carProperties.depth*0.3 + carProperties.frontWindowProperties.offset), // 21
        new THREE.Vector3( -carProperties.width*0.65 - 1,  carProperties.height*0.6, vz - carProperties.frontWindowProperties.offset), // 17
        new THREE.Vector3( -carProperties.width*0.65 - 1,  carProperties.height*0.6, -vz + carProperties.frontWindowProperties.offset), // 18
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(vertice)
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 1, 2), 
        new THREE.Face3( 3, 2, 1),
    );
    
    geometry.computeVertexNormals()
    geometry.computeFaceNormals()

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)
    
    wall.add(phongMesh)

    obj.add(wall)
}

function createCarBack(obj, x, y, z) {
    const wall = new THREE.Object3D()

    const vz = carProperties.depth/2
    const wheelsY = y - carProperties.height + carProperties.wheelsProperties.radius

    let vertices = [
        new THREE.Vector3( -carProperties.width*0.1,  carProperties.height, carProperties.depth*0.3), // 0
        new THREE.Vector3( -carProperties.width*0.1,  carProperties.height, -carProperties.depth*0.3), // 21
        new THREE.Vector3( carProperties.width,  carProperties.height*0.6, vz ), // 1
        new THREE.Vector3( carProperties.width,  carProperties.height*0.6, -vz ), // 22
        new THREE.Vector3( carProperties.width,  wheelsY*0.4, vz ), // 2
        new THREE.Vector3( carProperties.width,  wheelsY*0.4, -vz ), // 23
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(
            vertice
        )
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 1, 2), 
        new THREE.Face3( 3, 2, 1), 
        new THREE.Face3( 5, 4, 2), 
        new THREE.Face3( 2, 3, 5),
    );

    geometry.computeVertexNormals()
    geometry.computeFaceNormals()

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)

    wall.add(phongMesh)

    const offset = 10
    vertices = [
        new THREE.Vector3( carProperties.width+1,  carProperties.height*0.6 - offset, vz - offset ), // 1
        new THREE.Vector3( carProperties.width+1,  carProperties.height*0.6 - offset, -vz + offset ), // 22
        new THREE.Vector3( carProperties.width+1,  carProperties.height*0.6 - offset - carProperties.backLightProperties.height, vz - offset ), // 1'
        new THREE.Vector3( carProperties.width+1,  carProperties.height*0.6 - offset - carProperties.backLightProperties.height, -vz + offset), // 22'
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(vertice)
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 1, 2), 
        new THREE.Face3( 3, 2, 1),
    );
    
    geometry.computeVertexNormals()
    geometry.computeFaceNormals()

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.backLightProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.backLightProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.backLightProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)
    
    wall.add(phongMesh)

    // draw window
    vertices = [
        new THREE.Vector3( -carProperties.width*0.1 + 1,  carProperties.height, carProperties.depth*0.3 - carProperties.frontWindowProperties.offset), // 0
        new THREE.Vector3( -carProperties.width*0.1 + 1,  carProperties.height, -carProperties.depth*0.3 + carProperties.frontWindowProperties.offset), // 21
        new THREE.Vector3( carProperties.width + 1,  carProperties.height*0.6, vz - carProperties.frontWindowProperties.offset), // 1
        new THREE.Vector3( carProperties.width +1,  carProperties.height*0.6, -vz + carProperties.frontWindowProperties.offset), // 22
    ]

    geometry = new THREE.Geometry();

    vertices.forEach(vertice => {
        geometry.vertices.push(vertice)
    })

    geometry.faces.push( 
        new THREE.Face3( 0, 1, 2), 
        new THREE.Face3( 3, 2, 1),
    );
    
    geometry.computeVertexNormals()
    geometry.computeFaceNormals()

    phongMaterial = new THREE.MeshPhongMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: carProperties.frontWindowProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)
    
    wall.add(phongMesh)
    
    obj.add(wall)
}

function createCyberTruck(obj, x, y, z) {
    const car = new THREE.Object3D()
    
    createChassis(car, x, y, z)
    /* left: 1
       right: -1 
    */
    createCarSide(car, x, y, z, 1) 
    createCarSide(car, x, y, z, -1)
    createCarFront(car, x, y, z)
    createCarBack(car, x, y, z)

    obj.add(car)
    console.log("car")
    console.log(car)
}

function createFloor(x, y, z) {
    floor = new THREE.Object3D()
    geometry = new THREE.BoxGeometry(floorProperties.width, floorProperties.height, floorProperties.depth);

    phongMaterial = new THREE.MeshPhongMaterial({ color: floorProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: floorProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: floorProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)

    floor.add(phongMesh)
    scene.add(floor)
}

function createPalanque(x, y, z) {
    palanque = new THREE.Object3D()
    geometry = new THREE.CylinderGeometry( palanqueProperties.radius, palanqueProperties.radius, palanqueProperties.height, 32);

    phongMaterial = new THREE.MeshPhongMaterial({ color: palanqueProperties.color, side: THREE.DoubleSide })
    phongMaterial.name = "phong"
    basicMaterial = new THREE.MeshBasicMaterial({ color: palanqueProperties.color, side: THREE.DoubleSide })
    basicMaterial.name = "basic"
    lambertMaterial = new THREE.MeshLambertMaterial({ color: palanqueProperties.color, side: THREE.DoubleSide })
    lambertMaterial.name = "lambert"

    phongMesh = new THREE.Mesh(geometry, phongMaterial)
    
    phongMesh.receiveShadow = true
    
    phongMesh.userData = { 
        "phong": phongMaterial, 
        "lambert": lambertMaterial, 
        "basic": basicMaterial
    }

    phongMesh.position.set(x, y, z)

    palanque.add(phongMesh)
    //palanque.add(basicMesh)
    //palanque.add(lambertMesh)
    scene.add(palanque)

    //Cria o CYBERTRUCK
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
    holofote3 = new Holofote(holofoteProperties.x * 0.3, holofoteProperties.y*1.3, -holofoteProperties.z)
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
    createOrthographicCamera(0, floorProperties.height+palanqueProperties.height, floorProperties.depth)
    camera = perspectiveCamera

    console.log(holofote1)

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    render()

    window.addEventListener("resize", onResize)
    window.addEventListener('keydown', keysPressed)
    window.addEventListener('keyup', keysReleased)
}
