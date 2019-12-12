import React, {Component} from 'react'
import * as THREE from 'three'
import {MapControls} from 'three/examples/jsm/controls/OrbitControls'
import stat from 'three/examples/jsm/libs/stats.module.js'
import drawCamera from './draw/drawCamera'
import drawRoom from './draw/drawRoom'
import drawWall from './draw/drawWall'
import drawDoor from './draw/drawDoor'

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
    this.controls.maxPolarAngle = 1.0341655727265222
    this.controls.minPolarAngle = 1.0341655727265222
    this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
  }

  init = () => {
    const {data} = this.props
    this.scene = new THREE.Scene()
    this.stats = new stat()
    window.document.body.appendChild( this.stats.dom );
    this.scene.background = new THREE.Color(0xeaeaea)
    this.scene.fog = new THREE.Fog(0xeaeaea, 500, 10000)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.set(1000, 500, 2000)

    this.drawMap()
    this.group = new THREE.Group()
    this.group.rotateX(Math.PI / 2)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)

    directionalLight.position.set(0.75, 0.75, 3.0).normalize()
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)

    directionalLight2.position.set(0.75, -0.75, 3.0).normalize()
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.7)

    drawWall(this)
    drawRoom(this)
    drawCamera(this)
    drawDoor(this)
    this.scene.add(ambientLight)
    this.scene.add(directionalLight)
    this.scene.add(directionalLight2)
    this.scene.add(this.group)
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
    console.log('draw calls:', this.renderer.info.render.calls)
  }

  render () {
    return <div ref={ref => this.el = ref} />

  }
}

export default Home
