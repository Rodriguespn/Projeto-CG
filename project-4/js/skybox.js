const skyboxProperties = {
    size:  40,
    firstSideTextureURl:  '../assets/nx.png',
    secondSideTextureURl:  '../assets/ny.png',
    thirdSideTextureURl:  '../assets/nz.png',
    fourthSideTextureURl:  '../assets/px.png',
    fifthSideTextureURl:  '../assets/py.png',
    sixthSideTextureURl:  '../assets/pz.png'   
}

class CaixaCelestial extends THREE.Object3D {
    constructor(x, y, z) {
        super()

        var imagesTextures = ['../assets/nx.png', 
            '../assets/ny.png',
            '../assets/nz.png',
            '../assets/px.png',
            '../assets/py.png',
            '../assets/pz.png']

        //var imagesBumpMap = ['./assets/dice-face-1-bumpMap.png', 
        //'./assets/dice-face-2-bumpMap.png',
        //'./assets/dice-face-3-bumpMap.png',
        //'./assets/dice-face-4-bumpMap.png',
        //'./assets/dice-face-5-bumpMap.png',
        //'./assets/dice-face-6-bumpMap.png']
        
        var materials = []

        for (var i = 0; i < 6; i++) {
            texture = new THREE.TextureLoader().load(imagesTextures[i])
            //bumpmap = new THREE.TextureLoader().load(imagesBumpMap[i])

            material = {
                basic: { color: 0xffffff,
                    map: texture,
                    wireframe: false},
                phong: { color: 0xffffff,
                    map: texture,
                    //bumpMap: bumpmap,
                    bumpScale: 0.7,
                    wireframe: false}
            }

            materials.push(material)
        }

        this.moving = true

        geometry = new THREE.BoxGeometry(skyboxProperties.size, skyboxProperties.size, skyboxProperties.size)
        mesh = new Mesh(geometry, materials)
        mesh.position.set(0, 0, 0)
        
        mesh.castShadow = true
        mesh.receiveShadow = true
        
        this.add(mesh) 
    }
}

function createSkybox(obj, x, y, z) {
    const ground = new THREE.Object3D()

    geometry = new THREE.BoxGeometry(skyboxProperties.size, skyboxProperties.size, skyboxProperties.size);

    let materials = []

    for (var i = 0; i < 6; i++) {
        texture = new THREE.TextureLoader().load(imagesTextures[i])

        material = {
            basic: { color: 0xffffff,
                map: texture,
                wireframe: false},
            phong: { color: 0xffffff,
                map: texture,
                //bumpMap: bumpmap,
                bumpScale: 0.7,
                wireframe: false}
        }

        materials.push(material)
    }
    
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