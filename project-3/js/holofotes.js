let holofote1, holofote2, holofote3

const holofoteProperties = {
    x: palanqueProperties.radius*1.4,
    y: palanqueProperties.radius*1.4,
    z: palanqueProperties.radius*1.4,
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
        this.activeIllumination = true
        this.lambertMode = false

        this.coneBasic = createCone(x, y, z, "basic")
        this.coneLambert = createCone(x, y, z, "lambert")
        this.conePhong = createCone(x, y, z, "phong")

        this.bulbBasic = createSphere(x, y, z, "basic")
        this.bulbLambert = createSphere(x, y, z, "lambert")
        this.bulbPhong = createSphere(x, y, z, "phong")

        this.coneColor = holofoteProperties.coneColorOff
        this.bulbColor = holofoteProperties.bulbColorOff
        this.cone = this.conePhong
        this.bulb = this.bulbPhong
        scene.add(this.cone)
        scene.add(this.bulb)
        this.light = createSpotLight(x-(holofoteProperties.coneHeight/2),
             y-(holofoteProperties.coneHeight/2), z-(holofoteProperties.coneHeight/2))

        scene.add(this)
    }

    turnLightOnorOff() {
        if(this.active) {
            //apaga a luz
            this.light.intensity = 0
            this.bulbBasic.children[0].material.color.set(holofoteProperties.bulbColorOff)
            this.bulbPhong.children[0].material.color.set(holofoteProperties.bulbColorOff)
            this.bulbLambert.children[0].material.color.set(holofoteProperties.bulbColorOff)

            this.coneBasic.children[0].material.color.set(holofoteProperties.coneColorOff)
            this.conePhong.children[0].material.color.set(holofoteProperties.coneColorOff)
            this.coneLambert.children[0].material.color.set(holofoteProperties.coneColorOff)

            if(this.lambertMode) {
                scene.remove(this.bulb)
                this.bulb = this.bulbLambert
                scene.add(this.bulb)
            }
            else {
                scene.remove(this.bulb)
                this.bulb = this.bulbPhong
                scene.add(this.bulb)
            }

            this.active = false
        }
        else {
            //liga a luz
            this.light.intensity = 1
            this.bulbBasic.children[0].material.color.set(holofoteProperties.bulbColorOn)
            this.bulbPhong.children[0].material.color.set(holofoteProperties.bulbColorOn)
            this.bulbLambert.children[0].material.color.set(holofoteProperties.bulbColorOn)

            this.coneBasic.children[0].material.color.set(holofoteProperties.coneColorOn)
            this.conePhong.children[0].material.color.set(holofoteProperties.coneColorOn)
            this.coneLambert.children[0].material.color.set(holofoteProperties.coneColorOn)

            scene.remove(this.bulb)
            this.bulb = this.bulbBasic
            scene.add(this.bulb)
            this.active = true
        }
    }

    illuminationCalculationOnorOff() {
        if(this.activeIllumination) {
            //desactiva iluminação
            scene.remove(this.cone)
            this.cone = this.coneBasic
            scene.add(this.cone)

            scene.remove(this.bulb)
            this.bulb = this.bulbBasic
            scene.add(this.bulb)

            this.activeIllumination = false
        }
        else {
            if(this.lambertMode) {
                scene.remove(this.cone)
                this.cone = this.coneLambert
                scene.add(this.cone)
                if(!this.active) {
                    scene.remove(this.bulb)
                    this.bulb = this.bulbLambert
                    scene.add(this.bulb)
                }
            }
            else {
                scene.remove(this.cone)
                this.cone = this.conePhong
                scene.add(this.cone)
                
                if(!this.active) {
                    scene.remove(this.bulb)
                    this.bulb = this.bulbPhong
                    scene.add(this.bulb)
                }
            }
            this.activeIllumination = true   
        }
    }

    shadingAlternation() {
        if (!this.activeIllumination) {
            return
        }
        if(this.lambertMode) {
            scene.remove(this.cone)
            this.cone = this.conePhong
            scene.add(this.cone)
            this.lambertMode = false
        }
        else {
            scene.remove(this.cone)
            this.cone = this.coneLambert
            scene.add(this.cone)
            this.lambertMode = true
        }
    }
}


function createCone(x, y, z, type) {
    cone= new THREE.Object3D()
    geometry = new THREE.ConeBufferGeometry(holofoteProperties.coneRadius, holofoteProperties.coneHeight, 32, 2);
    if (type == "phong") {
        material = new THREE.MeshPhongMaterial({ color: holofoteProperties.coneColorOff })
    }
    else if (type == "basic") {
        material = new THREE.MeshBasicMaterial({ color: holofoteProperties.coneColorOff })
    }
    if (type == "lambert") {
        material = new THREE.MeshLambertMaterial({ color: holofoteProperties.coneColorOff })
    }

    geometry.applyMatrix4( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( -Math.PI / 2, -Math.PI, 0 ) ) );
    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.position.set(x, y, z)
    mesh.lookAt(0, 0, 0)
    cone.add(mesh)
    //scene.add(cone)
    return cone
}

function createSphere(x, y, z, type) {
    sphere = new THREE.Object3D()
    geometry = new THREE.SphereGeometry(holofoteProperties.coneRadius*0.4, 20, 32)
    if (type == "phong") {
        material = new THREE.MeshPhongMaterial({ color: holofoteProperties.bulbColorOff })
    }
    else if (type == "basic") {
        material = new THREE.MeshBasicMaterial({ color: holofoteProperties.bulbColorOff })
    }
    if (type == "lambert") {
        material = new THREE.MeshLambertMaterial({ color: holofoteProperties.bulbColorOff })
    }

    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.position.set(x*0.95, y*0.95, z*0.95)
    sphere.add(mesh)
    //scene.add(sphere)
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
