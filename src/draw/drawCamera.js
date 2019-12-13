import * as THREE from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export default _this => {
  const {data} = _this.props
  const group = _this.scene
  if (!data.home.pieceOfFurniture) return
  const cameras = data.home.pieceOfFurniture.map(camera => camera._attributes).filter(camera => camera.name === 'camera')
  const objLoader = new OBJLoader()
  objLoader.load('camera.obj', object => {
      const cameraGeo = object.children.map(child => child.geometry)
      const cameraRangeGeometry = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(0, 120, 300, 30, 4))
      // cameraGeo.push(cameraRangeGeometry)
      console.log('camreraGeo', cameraGeo)
      const cameraMergedGeo = BufferGeometryUtils.mergeBufferGeometries(cameraGeo, false)
      console.log('cameraMergedGeo', cameraMergedGeo)
      const cameraMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x999999,
        emissive: 0x3377CC,
        shininess: 3,
        opacity: 0.3,
        transparent: true
      })

      const cameraMesh = new THREE.Mesh(cameraMergedGeo, cameraMaterial)
      cameraMesh.scale.set(0.5, 0.5, 0.5)
      cameraMesh.rotateX(0.18)

      const cameraInstanceMesh = new THREE.InstancedMesh(cameraMergedGeo, cameraMaterial, cameras.length)
      cameraInstanceMesh.frustumCulled = false
      const cameraTransform = new THREE.Object3D()
      // cameraTransform.rotateX(0.25)
      cameraTransform.scale.set(0.7, 0.7, 0.7)

      cameras.map((camera, index) => {
        const mesh = cameraMesh.clone()
        mesh.position.x = camera.x
        mesh.position.z = camera.y
        mesh.position.y = parseFloat(camera.elevation) - 245
        mesh.rotateY(-camera.angle)



        cameraTransform.position.x = camera.x
        cameraTransform.position.z = camera.y
        cameraTransform.position.y = parseFloat(camera.elevation) - 245
        cameraTransform.rotateY(-camera.angle || 0)
        cameraTransform.updateMatrix()

        cameraInstanceMesh.setMatrixAt(index, cameraTransform.matrix)
        cameraTransform.rotateY(camera.angle || 0)

        // group.add(mesh)
      })

    group.add(cameraInstanceMesh)
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    error => console.log('An error happened', error)
  )
  // console.log('cameras', cameras)
}
