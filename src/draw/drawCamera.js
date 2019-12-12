import * as THREE from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
export default _this => {
  const {data} = _this.props
  const group = _this.scene
  if(!data.home.pieceOfFurniture) return
  const cameras = data.home.pieceOfFurniture.map(camera => camera._attributes).filter(camera => camera.name === 'camera')
  const cameraMaterials = [
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x999999,
      emissive: 0x000000,
      shininess: 3,
      opacity: 1,
      transparent: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x999999,
      emissive: 0x666666,
      shininess: 3,
      opacity: 1,
      transparent: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x999999,
      emissive: 0x333333,
      shininess: 3,
      opacity: 1,
      transparent: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x999999,
      emissive: 0x1133055,
      shininess: 3,
      opacity: 1,
      transparent: false
    })
  ]
  const objLoader = new OBJLoader()
  objLoader.load('camera.obj', object => {
      let i = 0
      object.traverse(child => {
        if (child.isMesh) {
          child.material = cameraMaterials[i]
          i++
        }
      })
      const cameraRangeGeometry = new THREE.CylinderBufferGeometry(0, 120, 300, 400, 4)
      const cameraRangeMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x999999,
        emissive: 0x3377CC,
        shininess: 3,
        opacity: 0.15,
        transparent: true
      })
      const cameraRange = new THREE.Mesh(cameraRangeGeometry, cameraRangeMaterial)
      cameraRange.rotateX(-Math.PI / 2)
      cameraRange.rotateY(Math.PI / 4)
      // cameraRange.position.y = -73
      cameraRange.position.z = 105
      cameraRange.scale.set(0.7, 0.7, 0.7)


      const cameraGroup = new THREE.Group()
      cameraGroup.add(object)
      cameraGroup.add(cameraRange)
      cameraGroup.scale.set(3, 3, 3)
      // cameraGroup.rotateX(-Math.PI / 2)


      cameras.map(camera => {
        const mesh = cameraGroup.clone()
        mesh.position.x = camera.x
        mesh.position.z = camera.y
        mesh.position.y = parseFloat(camera.elevation) -245

        mesh.rotateY(-camera.angle)
        mesh.rotateX(0.72)
        group.add(mesh)
      })
      group.add( object )
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    error => console.log('An error happened', error)
  )
  console.log('cameras', cameras)
}
