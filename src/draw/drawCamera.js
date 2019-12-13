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
      const cameraMesh = new THREE.Mesh(cameraMergedGeo)

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
      cameraRange.position.z = 105
      cameraRange.scale.set(0.7, 0.7, 0.7)

      const cameraGroup = new THREE.Group()
      // cameraGroup.add(cameraMesh)
      cameraGroup.add(cameraRange)
      // cameraGroup.scale.set(3, 3, 3)


      const cameraMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x999999,
        emissive: 0x1133055,
        shininess: 3,
        opacity: 1,
        transparent: false
      })
      const cameraInstanceMesh = new THREE.InstancedMesh(cameraMergedGeo, cameraMaterial, cameras.length)
      const cameraTransform = new THREE.Object3D()
      const singleGeo = new THREE.Geometry()
      const rangeInstance = new THREE.InstancedMesh(cameraRangeGeometry, cameraRangeMaterial, cameras.length)
      rangeInstance.frustumCulled = false
      const rangeTransform = new THREE.Object3D()

      rangeTransform.rotateX(-Math.PI / 2)
      rangeTransform.rotateY(Math.PI / 4)
      rangeTransform.position.z = 105
      rangeTransform.scale.set(2, 2, 2)

      rangeTransform.updateMatrix()
      // rangeTransform.rotateY(0.72)
      object.scale.set(0.5, 0.5, 0.5)
      cameras.map((camera, index) => {
        const mesh = object.clone()
        mesh.position.x = camera.x
        mesh.position.z = camera.y
        mesh.position.y = parseFloat(camera.elevation) - 245

        mesh.rotateY(-camera.angle)
        mesh.rotateX(0.18)


        rangeTransform.position.x = camera.x
        rangeTransform.position.z = camera.y
        rangeTransform.position.y = parseFloat(camera.elevation) - 245

        rangeTransform.rotateZ(-camera.angle || 0)

        rangeTransform.updateMatrix()

        rangeInstance.setMatrixAt(index, rangeTransform.matrix)
        rangeTransform.rotateZ(camera.angle || 0)


        // console.log('mesh camera', mesh)
        // mesh.children[0].updateMatrix()
        // mesh.children[1].updateMatrix()
        // singleGeo.merge(mesh.children[0].geometry, mesh.children[0].matrix)
        // singleGeo.merge(mesh.children[1].geometry, mesh.children[1].matrix)

        // const rangeGeo = mesh.children[1].geometry
        // const rangeMesh = new THREE.Mesh(rangeGeo)
        // cameraTransform.position = mesh.children[0].position
        // cameraTransform.updateMatrix();
        // cameraInstanceMesh.setMatrixAt(index, cameraTransform.matrix);
        // group.add(rangeMesh)
        group.add(mesh)
      })
      // group.add(rangeInstance)
      const newSingleMesh = new THREE.Mesh(singleGeo, cameraMaterial)
      // group.add(newSingleMesh)
    },
    xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    error => console.log('An error happened', error)
  )
  // console.log('cameras', cameras)
}
