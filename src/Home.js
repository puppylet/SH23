import React, {Component} from 'react'
import * as THREE from 'three'
import {MapControls} from 'three/examples/jsm/controls/OrbitControls'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

class Home extends Component {

  constructor(props) {
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
    this.controls.minDistance = 100
    // this.controls.minAzimuthAngle = 1.0002008289939635
    // this.controls.maxAzimuthAngle = 1.0002008289939635
    this.controls.maxPolarAngle = 1.0341655727265222
    this.controls.minPolarAngle = 1.0341655727265222
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.position0 = {x: 1276.8817930944774, y: 671.3467202946568, z: 1668.983819411475}
    this.controls.target0 = {x: 327.0909146248481, y: 1.2788138680369656e-14, z: 1059.3994616137588}
  }

  init = () => {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xeaeaea)
    // this.scene.fog = new THREE.Fog(0xeaeaea, 500, 10000)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.set(1000, 500, 2000)

    this.drawMap()

    const group = new THREE.Group()
    group.rotateX(Math.PI/2);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)

    directionalLight.position.set(0.75, 0.75, 3.0).normalize()
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)

    directionalLight2.position.set(0.75, -0.75, 3.0).normalize()
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.7)

    this.drawWall(group)

    this.scene.add(ambientLight)
    this.scene.add(directionalLight)
    this.scene.add(directionalLight2)
    this.scene.add(group)


    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.el.appendChild(this.renderer.domElement)
    // this.stats = new Stats();
    // this.el.appendChild(this.stats.dom);

    window.addEventListener("resize", this.onWindowResize, false)
  }

  drawWall = group => {
    const {data} = this.props
    const extrudeSettings = {
      steps: 1,
      depth: 150,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
    }
    const material = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x666666, emissive: 0xcccccc, shininess: 3, opacity: 0.9, transparent: true })

    const wallGeometries = data.home.wall.map(wall => {
      console.log(wall)
      const {_attributes} = wall
      const shape = new THREE.Shape()
      const xStart = parseFloat(_attributes.xStart)
      const xEnd = parseFloat(_attributes.xEnd)
      const yStart = parseFloat(_attributes.yStart)
      const yEnd = parseFloat(_attributes.yEnd)
      shape.moveTo( xStart, yStart)
      shape.lineTo( xEnd, yEnd)
      shape.lineTo( xEnd, yEnd)
      shape.lineTo( xStart, yStart)
      shape.lineTo( xStart, yStart)
      return new THREE.ExtrudeBufferGeometry( shape, extrudeSettings )
    })
    const mergedWallGeometry = BufferGeometryUtils.mergeBufferGeometries(wallGeometries, false)
    const mesh = new THREE.Mesh(mergedWallGeometry, material);
    group.add(mesh)
  }

  drawMap = () => {
    const groundMaterial = new THREE.MeshBasicMaterial( { color:0x666666 } );
    const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial )
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  animate = () => {
    requestAnimationFrame( this.animate );
    this.render3d();
    this.controls && this.controls.update()
  }

  render3d = () => {
    this.renderer && this.renderer.render( this.scene, this.camera );
  }


  render() {
    return <div ref={ref => this.el = ref}/>

  }
}

export default Home
