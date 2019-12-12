import * as THREE from 'three'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export default _this => {
  const {data} = _this.props
  const {group} = _this
  const extrudeSettings = {
    steps: 1,
    depth: 300,
    bevelEnabled: false
  }
  const material = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x666666,
    emissive: 0xaaaaaa,
    shininess: 3,
    opacity: 0.95,
    transparent: false,
    side: THREE.DoubleSide,
    // wireframe: true
  })
  const material2 = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x666666,
    emissive: 0x333333,
    shininess: 3,
    opacity: 0.95,
    transparent: false
  })

  const topGeo = []
  let mergedGeo = new THREE.Geometry()
  const wallGeometries = data.home.wall.map(wall => {
    const {_attributes} = wall
    const shape = new THREE.Shape()
    const xStart = parseFloat(_attributes.xStart)
    const xEnd = parseFloat(_attributes.xEnd)
    const yStart = parseFloat(_attributes.yStart)
    const yEnd = parseFloat(_attributes.yEnd)
    const height = parseFloat(_attributes.height)
    const thickness = parseFloat(_attributes.thickness)
    const setting = {...extrudeSettings}

    const len = Math.sqrt((xStart - xEnd) * (xStart - xEnd) + (yStart - yEnd) * (yStart - yEnd))
    const tan = (yStart - yEnd) / (xStart - xEnd)
    const angle = Math.atan(tan)
    const deltaX = Math.sin(angle) * thickness / 2
    const deltaY = Math.cos(angle) * thickness / 2

    shape.moveTo(xStart - deltaX, yStart - deltaY)
    shape.lineTo(xEnd - deltaX, yEnd - deltaY)
    shape.lineTo(xEnd + deltaX, yEnd + deltaY)
    shape.lineTo(xStart + deltaX, yStart + deltaY)
    shape.lineTo(xStart - deltaX, yStart - deltaY)
    topGeo.push(new THREE.ExtrudeBufferGeometry(shape, {...setting, depth: 2}))
    mergedGeo.merge(new THREE.ExtrudeGeometry(shape, setting))
    return new THREE.ExtrudeBufferGeometry(shape, setting)
  })
  const topGeos = BufferGeometryUtils.mergeBufferGeometries(topGeo, false)
  const topMesh = new THREE.Mesh(topGeos, material2)
  topMesh.rotation.x = Math.PI / 2
  topMesh.position.y = 2
  const mergedWallGeometry = BufferGeometryUtils.mergeBufferGeometries(wallGeometries, false)
  const mesh = new THREE.Mesh(mergedWallGeometry, material)
  mesh.rotation.x = Math.PI / 2
  _this.scene.add(topMesh)
  _this.scene.add(mesh)
}
