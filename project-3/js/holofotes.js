let dirLight, holofote1, holofote2, holofote3

const holofoteProperties = {
    x: palanqueProperties.radius*1.1,
    y: palanqueProperties.radius*1.1,
    z: palanqueProperties.radius*1.1,
    coneRadius: palanqueProperties.radius*0.1,
    coneHeight: palanqueProperties.radius*0.2,
    coneColorOn: "#5aaf9f",
    coneColorOff: "#5aaf9f",
    bulbColorOn: "#ffff00",
    bulbColorOff: "#ffff00"
}

const spotLightProperties = {
    color: "#FFFFFF",
    intensity: 2,
    penumbra: 0.2,
    angle: Math.PI/5,
    shadowMapSizeWidth: floorProperties.width*10,
    shadowMapSizeHeight: 1000
}


function createCone(x, y, z) {
    cone= new THREE.Object3D()
    geometry = new THREE.ConeBufferGeometry(holofoteProperties.coneRadius, holofoteProperties.coneHeight, 32, 2);
    material = new THREE.MeshPhongMaterial({ color: holofoteProperties.coneColorOn })

    geometry.applyMatrix4( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -Math.PI / 2, -Math.PI, 0 ) ) );
    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.position.set(x, y, z)
    mesh.lookAt(0, 0, 0)
    cone.add(mesh)
    return cone
}

function createSphere(x, y, z) {
    sphere = new THREE.Object3D()
    geometry = new THREE.SphereGeometry(holofoteProperties.coneRadius*0.4, 20, 32)
    material = new THREE.MeshBasicMaterial({ color: holofoteProperties.bulbColorOn })
    mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(x*0.95, y*0.95, z*0.95)
    sphere.add(mesh)
    return sphere
}

function createHolofote(x, y, z) {
    holofote = new THREE.Object3D()

    //Criar o cone
    var cone = createCone(x, y, z)
    holofote.add(cone)

    //create SpotLight
    var spotlight = createSpotLight(x-(holofoteProperties.coneHeight/2), y-(holofoteProperties.coneHeight/2), z-(holofoteProperties.coneHeight/2))
    holofote.add(spotlight)

    //create Sphere
    var sphere = createSphere(x, y, z)
    holofote.add(sphere)


    scene.add(holofote)
    return holofote
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