import React, {Component} from 'react'
import * as THREE from 'three'
import {MapControls} from 'three/examples/jsm/controls/OrbitControls'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {GeometryUtils} from 'three/examples/jsm/utils/GeometryUtils.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {Vector2, Path} from 'three'

const ThreeBSP = require('three-js-csg')(THREE)


class Home extends Component {

  constructor (props) {
    super(props)
    this.renderer = null
    this.stats = null
    this.scene = null
    this.camera = null
    this.controls = null
  }

  componentDidMount () {
    this.init()
    this.animate()
    this.controls = new MapControls(this.camera, this.renderer.domElement)
    this.controls.maxDistance = 4000
    this.controls.minDistance = 100
    // this.controls.minAzimuthAngle = 1.0002008289939635
    // this.controls.maxAzimuthAngle = 1.0002008289939635
    this.controls.maxPolarAngle = 1.0341655727265222
    this.controls.minPolarAngle = 0.2341655727265222
    this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    this.controls.position0 = {x: 1276.8817930944774, y: 671.3467202946568, z: 1668.983819411475}
    this.controls.target0 = {x: 327.0909146248481, y: 1.2788138680369656e-14, z: 1059.3994616137588}
  }

  init = () => {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xeaeaea)
    this.scene.fog = new THREE.Fog(0xeaeaea, 500, 10000)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.set(1000, 500, 2000)

    this.drawMap()
    const group = new THREE.Group()
    group.rotateX(Math.PI / 2)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)

    directionalLight.position.set(0.75, 0.75, 3.0).normalize()
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)

    directionalLight2.position.set(0.75, -0.75, 3.0).normalize()
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.7)

    this.drawWall(group)
    this.drawRoom()
    this.drawCamera(group)
    // this.drawWallItems(group)
    // this.drawExample()

    this.scene.add(ambientLight)
    this.scene.add(directionalLight)
    this.scene.add(directionalLight2)
    this.scene.add(group)


    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.el.appendChild(this.renderer.domElement)
    window.addEventListener('resize', this.onWindowResize, false)
  }

  drawWall = group => {
    const {data} = this.props
    const extrudeSettings = {
      steps: 1,
      depth: 300,
      bevelEnabled: false
      // bevelThickness: 0,
      // bevelSize: 0,
      // bevelOffset: 0,
      // bevelSegments: 0
    }
    const material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x666666,
      emissive: 0xaaaaaa,
      shininess: 3,
      opacity: 0.95,
      transparent: false
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
      // console.log(wall)
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
    this.scene.add(topMesh)
    const mergedWallGeometry = BufferGeometryUtils.mergeBufferGeometries(wallGeometries, false)
    const mesh = new THREE.Mesh(mergedWallGeometry, material)

    let mesh2 = new THREE.Mesh(mergedGeo, material)
    // const totalBSP = new ThreeBSP(mesh2)
    // const holeGeometry = new THREE.BoxGeometry(91, 208, 30)
    // const holeCube = new THREE.Mesh(holeGeometry)
    // holeCube.rotateX(-Math.PI / 2)
    // holeCube.rotateY(1.5707964)
    // holeCube.position.x = 315.046234
    // holeCube.position.y = 611.91895 + (611.91895) / 2
    // holeCube.position.z = 240
    // const clipBSP = new ThreeBSP(holeCube)
    // const resultBSP = totalBSP.subtract(clipBSP)
    // const mesh3 = resultBSP.toMesh(material);
    // group.add(mesh3)
    // group.add(holeCube)
    // let mesh3 = mesh2.clone()
    data.home.doorOrWindow && data.home.doorOrWindow.forEach((item, index) => {
      console.log('item', item)
      const {_attributes: {x, y, width, height, angle, depth}} = item
      const holeGeometry = new THREE.BoxGeometry(width, height, depth)
      const holeCube = new THREE.Mesh(holeGeometry, new THREE.MeshBasicMaterial({color: 0x559398}))
      holeCube.rotateX(-Math.PI / 2)
      holeCube.rotateY(angle)
      holeCube.position.x = x
      holeCube.position.y = y
      holeCube.position.z = 140
      const door = new ThreeBSP(holeCube)
      group.add(holeCube)
      // group.add(mesh3)
    })
    // mesh.castShadow = true
    // const mesh3 = totalBSP.toMesh(material)
    group.add(mesh2)
  }

  drawCamera = group => {
    const {data} = this.props
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
        cameraGroup.rotateX(-Math.PI / 2)


        cameras.map(camera => {
          const mesh = cameraGroup.clone()
          mesh.position.x = camera.x
          mesh.position.y = camera.y
          mesh.position.z = 245 - parseFloat(camera.elevation)

          mesh.rotateY(-camera.angle)
          mesh.rotateX(0.72)
          group.add(mesh)
        })
        // group.add( object )
      },
      xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
      error => console.log('An error happened', error)
    )
    console.log('cameras', cameras)
  }

  drawDoor = () => {
    const {data} = this.props
    console.log(data.home.doorOrWindow.map(door => door._attributes))
  }

  drawRoom = () => {
    const {data} = this.props
    if (!data.home.room) return
    const material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x666666,
      emissive: 0x777777,
      shininess: 3,
      opacity: 0.95,
      transparent: false
    })
    const extrudeSettings = {
      steps: 1,
      depth: 2,
      bevelEnabled: false
    }
    const roomGeometries = data.home.room.map(room => {
      // console.log(room)
      const {point} = room
      const shape = new THREE.Shape()
      point.map((p, index) => {
        const x = parseFloat(p._attributes.x)
        const y = parseFloat(p._attributes.y)
        if (index === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      })
      return new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
    })

    const mergedRoomGeometry = BufferGeometryUtils.mergeBufferGeometries(roomGeometries, false)
    const mesh = new THREE.Mesh(mergedRoomGeometry, material)
    mesh.rotation.x = Math.PI / 2
    mesh.position.y = -245
    mesh.receiveShadow = true
    this.scene.add(mesh)
  }

  drawMap = () => {
    const groundMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc})
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(60000, 60000), groundMaterial)
    mesh.position.y = -252
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    this.scene.add(mesh)
  }

  drawWallItems = (group) => {
    const {data: {home: {doorOrWindow}}} = this.props
    // console.log("doorOrWindow", doorOrWindow)
    const loader = new GLTFLoader().setPath('models/')
    loader.load('doorway.glb', gltf => {
      gltf.scene.scale.set(180, 180, 100)

      gltf.scene.rotateX(-Math.PI / 2)
      // group.add(gltf.scene)
      doorOrWindow.forEach(item => {
        // console.log('item', item)
        // gltf.scene.position.set()
        const cloneScene = gltf.scene.clone()
        // console.log(cloneScene)
        cloneScene.rotateY(item._attributes.angle)
        cloneScene.position.set(item._attributes.x, item._attributes.y, 240)
        group.add(cloneScene)

      })
      // this.scene.add(gltf.scene)
    })
  }

  drawExample = () => {
    var cube_geometry = new THREE.CubeGeometry(3, 3, 3)
    var cube_mesh = new THREE.Mesh(cube_geometry)
    cube_mesh.position.x = -7
    var cube_bsp = new ThreeBSP(cube_mesh)
    var sphere_geometry = new THREE.SphereGeometry(1.8, 32, 32)
    var sphere_mesh = new THREE.Mesh(sphere_geometry)
    sphere_mesh.position.x = -7
    var sphere_bsp = new ThreeBSP(sphere_mesh)

    var subtract_bsp = cube_bsp.subtract(sphere_bsp)
    var result = subtract_bsp.toMesh(new THREE.MeshLambertMaterial({
      shading: THREE.SmoothShading,
      map: new THREE.TextureLoader().load('texture.png')
    }))
    result.geometry.computeVertexNormals()
    result.scale.set(300, 300, 300)
    this.scene.add(result)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.render3d()
    this.controls && this.controls.update()
  }

  render3d = () => {
    this.renderer && this.renderer.render(this.scene, this.camera)
  }


  render () {
    return <div ref={ref => this.el = ref} />

  }
}

export default Home
