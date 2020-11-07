let camera, orthoCamera, perspectiveCamera

const frustumSize = 75
const aspect = windowWidth / windowHeight

// updates the position of the orthogonal camera
function updateCameraPosition(obj, x, y, z, lookAt) {
    obj.position.x = x
    obj.position.y = y
    obj.position.z = z
    obj.lookAt(lookAt)
}

function createPerspectiveCamera() {
    perspectiveCamera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, floorProperties.depth*4)

    updateCameraPosition(perspectiveCamera, palanqueProperties.radius*3, floorProperties.depth*0.6, palanqueProperties.radius*3, scene.position)
}

function createOrthographicCamera(x, y, z) {
    orthoCamera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2,
         frustumSize / - 2, floorProperties.depth*1.5, -floorProperties.depth*1.5)

    orthoCamera.position.x = x
    orthoCamera.position.y = y
    orthoCamera.position.z = z
    orthoCamera.lookAt(0,0,0)
}





let cameraController = {
    orthoActive: false,
    perspectiveActive: true,
    getActiveCamera() {
        if (cameraController.orthoActive) {
            return orthoCamera
        }
        else {
            return perspectiveCamera
        }
    }
}