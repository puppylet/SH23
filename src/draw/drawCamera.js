import * as THREE from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {wallDept} from '../config'

export default _this => {
  const {data} = _this.props
  const group = _this.scene
  if (!data.home.pieceOfFurniture) return
  if (data.home.pieceOfFurniture._attributes) data.home.pieceOfFurniture = [data.home.pieceOfFurniture]
  const cameras = data.home.pieceOfFurniture.map(camera => camera._attributes).filter(camera => camera.name === 'camera')
  const objLoader = new OBJLoader()
  objLoader.load('camera.obj', object => {
      const cameraGeo = object.children.map(child => child.geometry)
      const cameraMergedGeo = BufferGeometryUtils.mergeBufferGeometries(cameraGeo, false)
      const localPlane = new THREE.Plane( new THREE.Vector3( 1, 0, 0), 0.8 );
      var helper = new THREE.PlaneHelper( localPlane, 1, 0xffff00 );
      _this.scene.add( helper );
      const cameraMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x999999,
        emissive: 0x3377CC,
        shininess: 3,
        opacity: 0.3,
        transparent: true,
        clippingPlanes: [ localPlane ]
      })
      const cameraInstanceMesh = new THREE.InstancedMesh(cameraMergedGeo, cameraMaterial, cameras.length)
      cameraInstanceMesh.frustumCulled = false
      const cameraTransform = new THREE.Object3D()
      cameraTransform.scale.set(0.7, 0.7, 0.7)

      cameras.map((camera, index) => {
        cameraTransform.position.x = camera.x
        cameraTransform.position.z = camera.y
        cameraTransform.position.y = -wallDept * 1.2
        cameraTransform.rotateY(-camera.angle || 0)
        cameraTransform.updateMatrix()
        cameraInstanceMesh.setMatrixAt(index, cameraTransform.matrix)
        cameraTransform.rotateY(camera.angle || 0)
      })
    group.add(cameraInstanceMesh)
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    error => console.log('An error happened', error)
  )
}
