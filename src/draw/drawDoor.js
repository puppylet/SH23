import * as THREE from 'three'

export default _this => {
  const {group, props: {data}} = _this
  const doorGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
  const doorMaterial = new THREE.MeshBasicMaterial({
    color: 0x559398,
    transparent: false,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
  const doorMesh = new THREE.InstancedMesh( doorGeometry, doorMaterial, data.home.doorOrWindow.length );
  doorMesh.frustumCulled = false
  const transform = new THREE.Object3D();
  transform.rotateX(Math.PI / 2)

  data.home.doorOrWindow && data.home.doorOrWindow.forEach((item, index) => {
    const {_attributes: hole} = item
    const x = parseFloat(hole.x)
    const y = parseFloat(hole.y)
    const width = parseFloat(hole.width)
    const height = parseFloat(hole.height)
    const depth = parseFloat(hole.depth)
    const angle = parseFloat(hole.angle)
    transform.position.set( x, y, 200);
    transform.scale.set(width - 5, height, depth + 10)
    transform.rotateY(angle || 0)
    transform.updateMatrix();
    doorMesh.setMatrixAt(index, transform.matrix);
    transform.rotateY(-angle || 0)
  })

  group.add(doorMesh)
}
