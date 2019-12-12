import * as THREE from 'three'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
export default _this => {
  const {data} = _this.props
  const group = _this.scene
  if (!data.home.room) return
  const loader = new THREE.FontLoader();
  loader.load('/fonts/helvetiker_regular.typeface.json', font => {
    const material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x666666,
      emissive: 0x777777,
      shininess: 3,
      opacity: 0.95,
      // wireframe: true,
      transparent: false
    })
    const extrudeSettings = {
      steps: 1,
      depth: 2,
      bevelEnabled: false
    }
    const fontMaterial = new THREE.LineBasicMaterial( {
      color: 0x006699,
      side: THREE.DoubleSide
    } );
    const box = new THREE.Box3()

    const singleTextGeometry = new THREE.Geometry()

    const roomGeometries = data.home.room.map(room => {
      const {point, _attributes = {}} = room
      const shape = new THREE.Shape()
      point.map((p, index) => {
        const x = parseFloat(p._attributes.x)
        const y = parseFloat(p._attributes.y)
        if (index === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      })

      const shapeGeometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)

      // draw text
      const roomMesh = new THREE.Mesh(shapeGeometry)
      box.setFromObject(roomMesh)
      const center = box.getCenter()

      let textSize = 50

      if(room.textStyle) {
        const nameStyle = room.textStyle.find(style => style._attributes.attribute === 'nameStyle')
        const fontSize = parseFloat(nameStyle._attributes.fontSize)
        // console.log('fontSize', fontSize)
        textSize =  50 / 76 * fontSize
      }

      const fontShape = font.generateShapes( _attributes.name || '', textSize );

      const fontGeometry = new THREE.ShapeGeometry(fontShape)
      const text = new THREE.Mesh( fontGeometry, fontMaterial );
      text.rotateX(-Math.PI / 2)
      if (_attributes.nameAngle) {
        text.rotateZ(parseFloat(_attributes.nameAngle))
      }

      text.position.x = center.x + (_attributes.nameXOffset ? parseFloat(_attributes.nameXOffset) : 0)
      text.position.z = center.y + (_attributes.nameYOffset ? parseFloat(_attributes.nameYOffset) : 0)
      text.position.y = -245

      const textBox  = new THREE.Box3().setFromObject(text)

      const {min, max} = textBox
      const deltaX = (max.x - min.x) / 2
      const deltaZ = (max.z - min.z) / 2

      text.position.x = center.x - deltaX + (_attributes.nameXOffset ? parseFloat(_attributes.nameXOffset) : 0)
      text.position.z = center.y - deltaZ + (_attributes.nameYOffset ? parseFloat(_attributes.nameYOffset) : 0)

      if(_attributes.name === 'West Vestibule') {
        console.log('room', room)
        console.log(_attributes.name )
        console.log('textBox', textBox)
        console.log('deltaX', deltaX)
        console.log('deltaZ', deltaZ)
        // const boxMesh = new THREE.Box3Helper(textBox, 0xffff00)
        // this.scene.add(boxMesh)
      }

      text.updateMatrix()
      singleTextGeometry.merge(text.geometry, text.matrix)


      // const boxMesh = new THREE.Box3Helper(textBox, 0xffff00)
      // this.scene.add(boxMesh)



      // this.scene.add(text)
      return shapeGeometry
    })

    const singleTextMesh = new THREE.Mesh(singleTextGeometry, fontMaterial)
    group.add(singleTextMesh)

    const mergedRoomGeometry = BufferGeometryUtils.mergeBufferGeometries(roomGeometries, false)
    const mesh = new THREE.Mesh(mergedRoomGeometry, material)
    mesh.rotation.x = Math.PI / 2
    mesh.position.y = -248
    mesh.receiveShadow = true
    group.add(mesh)
  })
}
