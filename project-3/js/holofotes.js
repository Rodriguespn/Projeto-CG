let dirLight, holofote1, holofote2, holofote3

const holofoteProperties = {
    x: palanqueProperties.radius*1.1,
    y: palanqueProperties.radius*1.1,
    z: palanqueProperties.radius*1.1,
    coneRadius: palanqueProperties.radius*0.1,
    coneHeight: palanqueProperties.radius*0.2,
    coneColorOn: "#ffa500",
    coneColorOff: "#696969",
    bulbColorOn: "#ffff00",
    bulbColorOff: "#fffaf0"
}

const spotLightProperties = {
    //starting properties of a spotlight 
    color: "#FFFFFF",
    intensity: 0,
    penumbra: 0.2,
    angle: Math.PI/5,
    shadowMapSizeWidth: floorProperties.width*10,
    shadowMapSizeHeight: floorProperties.width*10
}

class Holofote extends THREE.Object3D {
    constructor(x , y, z) {
        super()

        //inicia desligada
        this.active = false

        this.cone = createCone(x, y, z)
        this.bulb = createSphere(x, y, z)
        this.light = createSpotLight(x-(holofoteProperties.coneHeight/2),
             y-(holofoteProperties.coneHeight/2), z-(holofoteProperties.coneHeight/2))

        scene.add(this)
    }

    turnOnorOff() {
        if(this.active) {
            //apaga a luz
            this.light.intensity = 0
            this.bulb.children[0].material.color.set(holofoteProperties.bulbColorOff)
            this.cone.children[0].material.color.set(holofoteProperties.coneColorOff)
            this.active = false
        }
        else {
            //liga a luz
            this.light.intensity = 2
            this.bulb.children[0].material.color.set(holofoteProperties.bulbColorOn)
            this.cone.children[0].material.color.set(holofoteProperties.coneColorOn)
            this.active = true
        }
    }
}


function createCone(x, y, z) {
    cone= new THREE.Object3D()
    geometry = new THREE.ConeBufferGeometry(holofoteProperties.coneRadius, holofoteProperties.coneHeight, 32, 2);
    material = new THREE.MeshPhongMaterial({ color: holofoteProperties.coneColorOff })

    geometry.applyMatrix4( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -Math.PI / 2, -Math.PI, 0 ) ) );
    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.position.set(x, y, z)
    mesh.lookAt(0, 0, 0)
    cone.add(mesh)
    scene.add(cone)
    return cone
}

function createSphere(x, y, z) {
    sphere = new THREE.Object3D()
    geometry = new THREE.SphereGeometry(holofoteProperties.coneRadius*0.4, 20, 32)
    material = new THREE.MeshBasicMaterial({ color: holofoteProperties.bulbColorOff })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x*0.95, y*0.95, z*0.95)
    sphere.add(mesh)
    scene.add(sphere)
    return sphere
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
    return light
}
