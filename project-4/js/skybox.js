const skyboxProperties = {
    width:  groundProperties.side * 4,
    lenght:  groundProperties.side * 4,
    height:  (groundProperties.height + groundProperties.golfFlagProperties.height) * 4,
    firstSideTextureURl:  'assets/px.png',
    secondSideTextureURl:  'assets/nx.png',
    thirdSideTextureURl:  'assets/py.png',
    fourthSideTextureURl:  'assets/ny.png',
    fifthSideTextureURl:  'assets/pz.png',
    sixthSideTextureURl:  'assets/nz.png',   
}

function createSkybox(obj, x, y, z) {
    const loader = new THREE.CubeTextureLoader()

    const texture = loader.load([
        skyboxProperties.firstSideTextureURl, 
        skyboxProperties.secondSideTextureURl, 
        skyboxProperties.thirdSideTextureURl, 
        skyboxProperties.fourthSideTextureURl, 
        skyboxProperties.fifthSideTextureURl, 
        skyboxProperties.sixthSideTextureURl
    ])
    obj.background = texture
}