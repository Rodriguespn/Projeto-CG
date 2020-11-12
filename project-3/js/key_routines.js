/**
*Funções de tratamento de teclas premidas
*
*/

let qQPress = {
    state: false,
    //liga ou desliga a fonte de luz direccional
    action: function() {
        dirLight.turnLightOnorOff()
        this.state = false
    }
}

let wWPress = {
    state: false,
    //liga ou desliga o cálculo da iluminação
    action: function() {
        holofote1.illuminationCalculationOnorOff()
        holofote2.illuminationCalculationOnorOff()
        holofote3.illuminationCalculationOnorOff()
        toggleBasicPhong(scene)
        this.state = false
    }
}

function toggleBasicPhong(obj) {
    if (obj == undefined) return

    if (obj.material) {
        if (obj.material.name == "phong" || obj.material.name == "lambert") {
            obj.userData.previousMaterial = obj.material.name
            obj.material = obj.userData["basic"]
        } else if (obj.material.name == "basic") {
            obj.material = obj.userData[obj.userData.previousMaterial]
        }
    }
    for (let i = 0; i < obj.children.length; i++) {
        toggleBasicPhong(obj.children[i])
    }
    return 
}

function toggleLambertPhong(obj) {
    if (obj == undefined) return

    if (obj.material) {
        if (obj.material.name == "phong") {
            obj.material = obj.userData["lambert"]
            obj.userData.previousMaterial = obj.material.name
        } else if (obj.material.name == "lambert") {
            obj.material = obj.userData["phong"]
            obj.userData.previousMaterial = obj.material.name
        }
    }
    for (let i = 0; i < obj.children.length; i++) {
        toggleLambertPhong(obj.children[i])
    }
    return 
}

let eEPress = {
    state: false,
    //alterna entre os tipos de sombreamento Phong ou Gouraud
    action: function() {
        holofote1.shadingAlternation()
        holofote2.shadingAlternation()
        holofote3.shadingAlternation()
        toggleLambertPhong(scene)
        this.state = false
    }
}

let one1Press = {
    state: false,
    //liga ou desliga o holofote #1
    action: function() {
        holofote1.turnLightOnorOff()
        this.state = false
    }
}

let two2Press = {
    state: false,
    //liga ou desliga o holofote #2
    action: function() {
        holofote2.turnLightOnorOff()
        this.state = false
    }
}

let three3Press = {
    state: false,
    //liga ou desliga o holofote #3
    action: function() {
        holofote3.turnLightOnorOff()
        this.state = false
    }
}

let four4Press = {
    state: false,
    //activa a camera fixa perspectiva - tecla 4
    action: function() {
        cameraController.perspectiveActive = true
        cameraController.orthoActive = false
        camera = cameraController.getActiveCamera()
        this.state = false
    }
}

let five5Press = {
    state: false,
    //activa a camera fixa ortogonal - tecla 5
    action: function() {
        cameraController.orthoActive = true
        cameraController.perspectiveActive = false
        camera = cameraController.getActiveCamera()
        this.state = false
    }
}


let arrowRightPress = {
    state: false,
    //roda o palanque para a direita
    action: function() {
        rotatePalanque(Math.PI/palanqueProperties.rotationFactor)
        this.state = false
    },
}


let arrowLeftPress = {
    state: false,
    //roda o palanque para a esquerda
    action: function() {
        rotatePalanque(-Math.PI/palanqueProperties.rotationFactor)
        this.state = false
    },
}



let actionKeys = [
    qQPress, //index 0
    wWPress, //index 1
    eEPress, //index 2
    one1Press, //index 3
    two2Press, //index 4
    three3Press, //index 5
    four4Press, //index 6
    five5Press, //index 7
    arrowRightPress,//index 8
    arrowLeftPress //index 9
]

//checks for pressed keys
function keysPressedChecker() {
    for (i = 0; i < actionKeys.length; i++) {
        if (actionKeys[i].state == true) {
            actionKeys[i].action()
        }
    } 
}

function keysPressed(event) {
    switch(event.code) {
        case 'KeyQ':
            actionKeys[0].state = true
            break;
        case 'KeyW':
            actionKeys[1].state = true
            break;
        case 'KeyE':
            actionKeys[2].state = true
            break;
        case 'Digit1':
            actionKeys[3].state = true
            break;
        case 'Digit2':
            actionKeys[4].state = true
            break;
        case 'Digit3':
            actionKeys[5].state = true
            break;
        case 'Digit4':
            actionKeys[6].state = true
            break;
        case 'Digit5':
            actionKeys[7].state = true
            break;
        case 'ArrowRight':
            actionKeys[8].state = true
            break;
        case 'ArrowLeft':
            actionKeys[9].state = true
            break;
    }
}

function keysReleased(event) {
    switch(event.code) {

    }
}