const skyboxProperties = {
    width:  groundProperties.side * 3,
    lenght:  groundProperties.side * 3 ,
    height:  (groundProperties.height + groundProperties.golfFlagProperties.height) * 4,
    firstSideTextureURl:  'assets/px.png',
    secondSideTextureURl:  'assets/nx.png',
    thirdSideTextureURl:  'assets/py.png',
    fourthSideTextureURl:  'assets/ny.png',
    fifthSideTextureURl:  'assets/pz.png',
    sixthSideTextureURl:  'assets/nz.png',   
}

function createSkybox(obj, x, y, z) {
    const geometry = new THREE.CubeGeometry(skyboxProperties.width, skyboxProperties.height, skyboxProperties.lenght)

    const textures = [
        skyboxProperties.firstSideTextureURl, 
        skyboxProperties.secondSideTextureURl, 
        skyboxProperties.thirdSideTextureURl, 
        skyboxProperties.fourthSideTextureURl, 
        skyboxProperties.fifthSideTextureURl, 
        skyboxProperties.sixthSideTextureURl
    ]

    const materials = []

    for (let i = 0; i < 6; i++) {
        const material = new THREE.MeshBasicMaterial(
            {
                map: new THREE.TextureLoader().load(textures[i]),
                side: THREE.DoubleSide,
            }
        )
        materials.push(material)
    }

    const mesh = new THREE.Mesh(geometry, materials)
    
    mesh.position.set(x, y, z)
    obj.add(mesh)
}