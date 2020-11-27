// teste
const directionalLightProperties = {
    intensityOff: 0,
    intensityOn: 1,
    color: '#ffffff'
}

const pointLightProperties = {
    intensityOff: 0,
    intensityOn: 1,
    color: '#ffffff'
}

class PLight extends THREE.PointLight {
    constructor(x, y, z, lookAtObject) {
        super(pointLightProperties.color, pointLightProperties.intensityOn)
        this.active = true

        this.position.set(x, y, z);
        this.castShadow = true;
        this.target = lookAtObject
    }

    turnLightOnorOff() {
        if (this.active){
            //vai desligar a luz
            this.intensity = pointLightProperties.intensityOff
            this.active = false
        }
        else {
            this.intensity = pointLightProperties.intensityOn
            this.active = true
        }
    }

}

class DirLight extends THREE.DirectionalLight {
    constructor(x, y, z, lookAtObject) {
        super(directionalLightProperties.color, directionalLightProperties.intensityOn)

        this.active = true

        this.castShadow = true
        this.position.set(x, y, z);
        
        this.target = lookAtObject

        this.shadow.camera.left = -groundProperties.side
        this.shadow.camera.right = groundProperties.side
        this.shadow.camera.bottom = -groundProperties.side
        this.shadow.camera.top = groundProperties.side
        this.shadow.camera.far = groundProperties.side*2.5
        this.shadow.camera.near = -groundProperties.side
    }

    turnLightOnorOff() {
        if (this.active){
            //vai desligar a luz
            this.intensity = directionalLightProperties.intensityOff
            this.active = false
        }
        else {
            this.intensity = directionalLightProperties.intensityOn
            this.active = true
        }
    }

    createDirectionalLight(x, y, z) {
        this.light = new THREE.DirectionalLight(directionalLightProperties.color, directionalLightProperties.intensityOn);
        this.light.castShadow = true;
        this.light.active = this.active
        this.light.changeActiveState = false
        this.light.position.set(x, y, z);
        this.light.target.position.set(0, 0, 0);
        //scene.add(this.light);
        //scene.add(light.target);
    }
}