/**
*Funções de tratamento de teclas premidas
*
*/

'use strict'

let dDPress = {
    state: false,
    //liga ou desliga a fonte de luz direccional
    action: function() {
        dirLight.turnLightOnorOff()
        this.state = false
    }
}

let pPPress = {
    state: false,
    //liga ou desliga a fonte de luz pontual
    action: function() {
        pLight.turnLightOnorOff()
        this.state = false
    }
}

let wWPress = {
    state: false,
    //Liga ou desliga arames
    action: function() {
        switchWireframes(scene)
        this.state = false
    }
}

let iIPress = {
    state: false,
    //Liga ou desliga o cálculo de iluminação
    action: function() {
        illuminationCalculation(scene)
        this.state = false
    }
}

let bBPress = {
    state: false,
    //Controla a bola, inicia movimento ou pára movimento
    action: function() {
        ballMovement()
        this.state = false
    }
}

let sSPress = {
    state: false,
    //Pausa
    action: function() {
        pauseScene()
        this.state = false
    }
}

let rRPress = {
    state: false,
    //reset o programa
    action: function() {
        resetScene()
        this.state = false
    }
}

let actionKeys = [
    dDPress, 
    pPPress, 
    wWPress, 
    iIPress, 
    bBPress, 
    sSPress, 
    rRPress
]

//checks for pressed keys
function keysPressedChecker() {
    for (let i = 0; i < actionKeys.length; i++) {
        if (actionKeys[i].state == true) {
            actionKeys[i].action()
        }
    } 
}

function keysPressed(event) {
    switch(event.code) {
        case 'KeyD':
            actionKeys[0].state = true
            break;
        case 'KeyP':
            actionKeys[1].state = true
            break;
        case 'KeyW':
            actionKeys[2].state = true
            break;
        case 'KeyI':
            actionKeys[3].state = true
            break;
        case 'KeyB':
            actionKeys[4].state = true
            break;
        case 'KeyS':
            actionKeys[5].state = true
            break;
        case 'KeyR':
            actionKeys[6].state = true
            break;
    }
}

function keysReleased(event) {
    switch(event.code) {

    }
}