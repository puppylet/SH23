import * as THREE from 'three'
import {wallDept} from '../config'

export default _this => {
  const {group, props: {data: {home}}} = _this
  if (!home.doorOrWindow) home.doorOrWindow = []
  if (home.doorOrWindow._attributes) home.doorOrWindow = [home.doorOrWindow]
  const doorGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
  const doorMaterial = new THREE.MeshBasicMaterial({
    color: 0x559398,
    transparent: false,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
  const doorMesh = new THREE.InstancedMesh( doorGeometry, doorMaterial, home.doorOrWindow.length );
  doorMesh.frustumCulled = false
  const transform = new THREE.Object3D();
  transform.rotateX(Math.PI / 2)


  home.doorOrWindow && home.doorOrWindow.forEach((item, index) => {
    const {_attributes: hole} = item
    const x = parseFloat(hole.x)
    const y = parseFloat(hole.y)
    const width = parseFloat(hole.width)
    const height = parseFloat(hole.height)
    const depth = parseFloat(hole.depth)
    const angle = parseFloat(hole.angle)
    transform.position.set( x, y, wallDept*2 * 0.8);
    transform.scale.set(width - 5, wallDept*0.8, depth + 10)
    transform.rotateY(angle || 0)
    transform.updateMatrix();
    doorMesh.setMatrixAt(index, transform.matrix);
    transform.rotateY(-angle || 0)
  })

  group.add(doorMesh)
}
