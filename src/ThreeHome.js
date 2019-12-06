import React, {Component} from 'react'
import {MapControls} from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'

export default class ThreeHome extends Component {
  constructor (props) {
    super(props)
    this.renderer = null
    this.stats = null
    this.scene = null
    this.camera = null
    this.controls = null
  }

  componentDidMount() {
    this.init()
    this.animate()
    this.controls = new MapControls(this.camera, this.renderer.domElement)
    this.controls.maxDistance = 10000
    this.controls.minDistance = 10
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
    this.scene.background = new THREE.Color(0xeaeaea)
    // this.scene.fog = new THREE.Fog(0xeaeaea, 500, 10000)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000)
    this.camera.position.set(1000, 500, 2000)


    const group = new THREE.Group()
    group.rotateX(Math.PI / 2)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)

    directionalLight.position.set(0.75, 0.75, 3.0).normalize()
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)

    directionalLight2.position.set(0.75, -0.75, 3.0).normalize()
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.7)

    this.drawWall(group)
    this.drawMap()
    // this.drawRoom()
    // this.drawCamera(group)
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

  drawMap = () => {
    const groundMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc})
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(60000, 60000), groundMaterial)
    mesh.position.y = -252
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    this.scene.add(mesh)
  }


  drawWall = group => {
    const {data: {walls}} = this.props
    const material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, flatShading: true, side: THREE.DoubleSide } );
    const wallGeometries = Object.keys(walls).map(key => {
      const wall = walls[key]
      const xStart = parseFloat(wall.xStart)
      const xEnd = parseFloat(wall.xEnd)
      const yStart = parseFloat(wall.yStart)
      const yEnd = parseFloat(wall.yEnd)
      const height = parseFloat(wall.height)
      const thickness = parseFloat(wall.thickness)

      const tan = (yStart - yEnd) / (xStart - xEnd)
      const angle = Math.atan(tan)
      const deltaX = Math.sin(angle) * thickness / 2
      const deltaY = Math.cos(angle) * thickness / 2
      const wallGeometry = new THREE.Geometry();
      wallGeometry.vertices.push(
        new THREE.Vector3(xStart - deltaX, 0, yStart + deltaY),
        new THREE.Vector3(xEnd - deltaX, 0, yEnd + deltaY),
        new THREE.Vector3(xEnd + deltaX, 0, yEnd - deltaY),
        new THREE.Vector3(xStart + deltaX, 0, yStart - deltaY),
        new THREE.Vector3(xStart - deltaX, height, yStart + deltaY),
        new THREE.Vector3(xEnd - deltaX, height, yEnd + deltaY),
        new THREE.Vector3(xEnd + deltaX, height, yEnd - deltaY),
        new THREE.Vector3(xStart + deltaX, height, yStart - deltaY)
      )

      const vertices = [
        xStart - deltaX, 0, yStart + deltaY,
        xEnd - deltaX, 0, yEnd + deltaY,
        xEnd + deltaX, 0, yEnd - deltaY,
        xStart + deltaX, 0, yStart - deltaY,

        xStart - deltaX, 300, yStart + deltaY,
        xEnd - deltaX, 300, yEnd + deltaY,
        xEnd + deltaX, 300, yEnd - deltaY,
        xStart + deltaX, 300, yStart - deltaY

      ]

      const indicesOfFaces = [
        2,1,0,    0,3,2,
        0,4,7,    7,3,0,
        0,1,5,    5,4,0,
        1,2,6,    6,5,1,
        2,3,7,    7,6,2,
        4,5,6,    6,7,4
      ]

      // while (vertices.length > 0) {
      //   const v = indicesOfFaces.splice(0,3)
      //   const ver = new THREE.Vector3(v[0], v[1], v[2])
      //   wallGeometry.vertices.push(ver)
      // }

      while (indicesOfFaces.length > 0) {
        const f = indicesOfFaces.splice(0,3)
        const face = new THREE.Face3(f[0], f[1], f[2])
        wallGeometry.faces.push(face)
      }

      const mesh = new THREE.Mesh(wallGeometry, material)
      this.scene.add(mesh)
    })
  }


  animate = () => {
    requestAnimationFrame(this.animate)
    this.render3d()
    this.controls && this.controls.update()
  }


  render3d = () => {
    this.renderer && this.renderer.render(this.scene, this.camera)
  }



  render() {
    return <div ref={ref => this.el = ref} />
  }
}

