import React, {Component} from 'react'
import * as THREE from 'three'
import {MapControls} from 'three/examples/jsm/controls/OrbitControls'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import stat from 'three/examples/jsm/libs/stats.module.js';

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
    this.controls.minPolarAngle = 1.0341655727265222
    // this.controls.minPolarAngle = 0.2341655727265222
    this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    // this.controls.position0 = {x: 1276.8817930944774, y: 671.3467202946568, z: 1668.983819411475}
    // this.controls.target0 = {x: 327.0909146248481, y: 1.2788138680369656e-14, z: 1059.3994616137588}
  }

  init = () => {
    this.scene = new THREE.Scene()
    this.stats = new stat()
    window.document.body.appendChild( this.stats.dom );
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
    // this.drawExample(group)

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
      transparent: false,
      side: THREE.DoubleSide,
      wireframe: true
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
    // this.scene.add(topMesh)
    const mergedWallGeometry = BufferGeometryUtils.mergeBufferGeometries(wallGeometries, false)
    const mesh = new THREE.Mesh(mergedWallGeometry, material)


    // make holes in the walls
    const manager = new THREE.LoadingManager()
    const mtlLoader = new MTLLoader( manager )
    const objLoader = new OBJLoader( )
    const svgLoader = new SVGLoader()
    mtlLoader.load('/models/obj/Door/door.mtl', materials => {
      console.log('door ,tl;', materials)
      materials.preload();
      objLoader
        .setMaterials( materials )
        .setPath( '/models/obj/' )
        .load( 'Door/door.obj', doorObject => {
          console.log('door', doorObject)
          doorObject.rotateX(-Math.PI/2)
          doorObject.children[2].material = new THREE.MeshBasicMaterial({color: 0x999999})

          svgLoader.load( '/lock.svg', ( svgData ) => {
            const path = svgData.paths[0]
            const shape = path.toShapes(false)
            const svgGeometry = new THREE.ExtrudeBufferGeometry(shape, {depth: 150, bevelEnabled: false,})
            const svgMesh = new THREE.Mesh(svgGeometry, new THREE.MeshBasicMaterial({color: 0x990000}))
            svgMesh.rotateX(Math.PI)
            svgMesh.scale.set(0.05, 0.05, 0.05)
            // this.scene.add( svgMesh );


            let mesh2 = new THREE.Mesh(mergedGeo, material)
            // let totalBSP = new ThreeBSP(mesh2)
            data.home.doorOrWindow && data.home.doorOrWindow.forEach((item, index) => {
              const {_attributes: hole} = item
              const x = parseFloat(hole.x, 10)
              const y = parseFloat(hole.y, 10)
              const width = parseFloat(hole.width, 10)
              const height = parseFloat(hole.height, 10)
              const depth = parseFloat(hole.depth, 10)
              const angle = parseFloat(hole.angle, 10)
              const holeGeometry = new THREE.BoxGeometry(1, 1, 1)
              const holeCube = new THREE.Mesh(holeGeometry, new THREE.MeshBasicMaterial({color: 0x559398, transparent: false, opacity: 0.5}))
              // const holeCube2 = new THREE.Mesh(holeGeometry, new THREE.MeshBasicMaterial({color: 0x559398, transparent: true, opacity: 0.5}))
              holeCube.rotateX(-Math.PI / 2)
              holeCube.scale.set(width - 5, height, depth + 10)
              holeCube.rotateY(-angle || 0)
              holeCube.position.x = x
              holeCube.position.y = y
              holeCube.position.z = 140
              group.add(holeCube)
              // const holdeMesh =


              // const cloneDoorObject = doorObject.clone()
              // const cloneLockModel = svgMesh.clone()
              // const groupTemp = new THREE.Group()
              // groupTemp.rotateX(-Math.PI / 2)
              // groupTemp.rotateY(-angle || 0)
              // groupTemp.position.x = x
              // groupTemp.position.y = y
              // groupTemp.position.z = 140
              // groupTemp.add(holeCube2)
              // groupTemp.add(cloneDoorObject)
              // if (index % 3 === 0) {
              //   cloneDoorObject.children[0].rotateZ(-Math.PI/3)
              //   cloneDoorObject.children[0].translateY(-45)
              //   cloneDoorObject.children[0].translateX(30)
              //
              //   cloneDoorObject.children[1].rotateZ(-Math.PI/3)
              //   cloneDoorObject.children[1].translateY(-45)
              //   cloneDoorObject.children[1].translateX(30)
              //   cloneDoorObject.children[1].translateX(30)
              //
              //   cloneDoorObject.children[3].rotateZ(-Math.PI/3)
              //   cloneDoorObject.children[3].translateY(-45)
              //   cloneDoorObject.children[3].translateX(30)
              // }
              // else if(index % 5 === 0) {
              //   cloneLockModel.translateX(-10)
              //   cloneLockModel.translateZ(-3)
              //   groupTemp.add(cloneLockModel)
              // }

              // group.add(groupTemp)

              // const doorHole = new ThreeBSP(holeCube)
              // const subtractBSP = totalBSP.subtract(doorHole)
              // if (subtractBSP.tree.polygons.length) {
              //   totalBSP = subtractBSP
              // }
            })
            // const newMesh = totalBSP.toMesh(material)
            // group.add(newMesh)
            group.add(mesh2)
            // make holes in the walls
            // make holes in the walls
          })

        });
    })

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
      // wireframe: true,
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
      gltf.scene.rotateX(-Math.PI / 2)
      const box = new THREE.Box3().setFromObject(gltf.scene)
      doorOrWindow.forEach(item => {
        const cloneScene = gltf.scene.clone()
        console.log('cone secen', cloneScene)
        const {_attributes: data} = item
        const x = parseFloat(data.x)
        const y = parseFloat(data.y)
        const width = parseFloat(data.width)
        const height = parseFloat(data.height)
        const depth = parseFloat(data.depth)
        const angle = parseFloat(data.angle)
        cloneScene.scale.set(width/(box.max.x - box.min.x), height/((box.max.z - box.min.z)*1), depth/(box.max.y - box.min.y))
        cloneScene.rotateY(angle)
        cloneScene.position.set(x, y, 140)
        group.add(cloneScene)

      })
    })
  }

  drawExample = (group) => {
    var geometry = new THREE.BoxBufferGeometry( 100, 100, 10 );
    var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    var material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );

    var cubeA = new THREE.Mesh( geometry, material );
    cubeA.position.set( 100, 10, 0 );

    var cubeB = new THREE.Mesh( geometry, material2 );
    cubeB.position.set( 0, 0, 0 );

    //create a group and add the two cubes
    //These cubes can now be rotated / scaled etc as a group
    var group1 = new THREE.Group();
    group1.add( cubeA );
    group1.add( cubeB );
    // group.add(group1)
    this.scene.add(group1)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.render3d()
    this.stats && this.stats.update()
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
