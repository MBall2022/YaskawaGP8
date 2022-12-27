/*
This is a simulation of a 6 axis Yaskawa GP8 Robot Arm - Version 1
December 2022

S: Base Axis (Rotates about z axis)
L: First arm Axis
U: Elbow Axis
R: Second arm (Roll)
B: Second elbow
T: Twist 
Uses on Screen GUI Controls

JSON version. GP8 CAD Geometry loads from a JSON Model.

*/



  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false
  });


//Creating the Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 5000);

//const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let controls = {};
let player = {
  height: 60,
  turnSpeed: .05,
  speed: .5,
  jumpHeight: 1,
  gravity: .01,
  velocity: 0,
  
  playerJumps: false
};

// Camera:Setup
camera.position.set(-150, player.height, -150);

camera.lookAt(new THREE.Vector3(0, player.height, 0));


var controls2 = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.minPolarAngle =Math.PI;  
  controls2.maxPolarAngle =Math.PI/2-0.2;
  controls2.minPolarAngle =0;
  controls2.enableDamping = true;
  controls2.dampingFactor = 0.25;
  controls2.enableZoom = false;
  //controls.target.set(0,0,0);
  //controls.update();
    camera.position.z = 150;
    camera.position.y = 90;
    camera.position.x = 150;
    camera.rotation.z=Math.PI;
    controls2.update();


// Controls:Listeners
document.addEventListener('keydown', ({ keyCode }) => { controls[keyCode] = true });
document.addEventListener('keyup', ({ keyCode }) => { controls[keyCode] = false });

// ...
function control() {
  // Controls:Engine 
  if(controls[87]){ // w
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(controls[83]){ // s
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if(controls[65]){ // a
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if(controls[68]){ // d
    camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }
 /* if(controls[37]){ // la
    camera.rotation.y -= player.turnSpeed;
  }
  if(controls[39]){ // ra
    camera.rotation.y += player.turnSpeed;
  }
  */
   /*if(controls[38]){ // ua
    camera.rotation.x += Math.sin(camera.rotation.y) * player.turnSpeed;
    camera.rotation.z -= -Math.cos(camera.rotation.y) * player.turnSpeed;
  }
  if(controls[40]){ // da
    camera.rotation.x = Math.sin(camera.rotation.y) * player.turnSpeed;
    camera.rotation.z += -Math.cos(camera.rotation.y) * player.turnSpeed;
  }
  */
  if(controls[32]) { // space
    if(player.jumps) return false;
    player.jumps = true;
    player.velocity = -player.jumpHeight;
  }
}

function ixMovementUpdate() {
  player.velocity += player.gravity;
  camera.position.y -= player.velocity;
  
  if(camera.position.y < player.height) {
    camera.position.y = player.height;
    player.jumps = false;
  }
}



//Adding lights to the scene

const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 80, 20, 20 );
spotLight.castShadow = true;
scene.add( spotLight );


const spotLight2 = new THREE.SpotLight( 0xffffff );
spotLight2.position.set( -80, 20, -20 );
spotLight2.castShadow = true;
scene.add( spotLight2 );

{
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
const light3 = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.2 );
light3.position.set( 0.5, 1, 0.75 );
scene.add( light3 );



//adding a floor
//Load the texture
var loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");
const texture = loader.load(
  'https://github.com/MBall2022/YaskawaGP8/blob/5575a30cd192b92408106035ddb0167a27ec3c5a/assets/floor3.jpeg');

  var Fmaterial = new THREE.MeshPhongMaterial({ color:0xFFFFFF, map: texture });
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
  
  //Create a plane with texture as floor
  var Fgeometry = new THREE.PlaneBufferGeometry(500, 500);
  //var material = new THREE.MeshBasicMaterial({ map: texture });
  var plane = new THREE.Mesh(Fgeometry, Fmaterial);
  plane.rotation.x=-Math.PI/2;
  plane.position.y=-70;
  scene.add(plane);


//Adding the  table (cart)
var sole=null; //VARIABLE TO ACCESS INDIVIDUAL OBJECT OUT OF THE JSON OBJECT

  var cartLoader = new THREE.ObjectLoader();

  cartLoader.load("models/GP8_cart.json", function (table) {
    //table.position.set(-90, -73, 40);
    //table.scale.set(4, 3, 2);
    scene.add(table); // Adding the conveyor belt model to the scene

    ////
    //ACCESSING AN INDIVIDUAL OBJECT OUT OF THE JSON OBJECT///// IT WORKS
    sole = table.getObjectByName( "Yaskawa GP8 extrusion.stl", true );
    //sole.position.x=-10;

  });


//Render the scene
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
      


/// Adding a yellow arrow showing the X Axis direction
/*
const dir = new THREE.Vector3( 1, 0, 0 );
//normalize the direction vector (convert to vector of length 1)
dir.normalize();
const origin = new THREE.Vector3( 0, 2, 0 );
const length = 1;
const hex = 0xffff00;
const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );
*///


const blueMaterial = new THREE.MeshPhongMaterial( { color: 0x002aff,  specular: 0xf5e490, wireframe: false, shininess:20} ); //Blue Material




//Adding a Grid Helper
/*
const size = 20;
const divisions = 1;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );
*/



//Adding a Keyboard listener to detect keydown events

/*
var rotspeed=0.03;

document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 49) { //'1' Key for Base Axis CCW
        motor0.rotation.y-= rotspeed;
    } else if (keyCode == 81) {//'q' key for Base Axis 1CW
        motor0.rotation.y+= rotspeed; 
    } else if (keyCode == 50) { //'2' key for Axis 2 CW
        motor1.rotation.x+= rotspeed;
    } else if (keyCode == 87) { //'w' key for Axis 2 CCW
        motor1.rotation.x-= rotspeed;
    } else if (keyCode == 51) {//'3' key for Axis 3 CW
        motor2.rotation.y-= rotspeed;
      } else if (keyCode == 69) {//'e' key for Axis 3 CCW
        motor2.rotation.y+= rotspeed;
    }
 
  };
*/
//Options to be added to the GUI
var options = {
  S_axisPos: 0,
  L_axisPos: 0,
  U_axisPos: 0,
  R_axisPos: 0,
  B_axisPos: 0,
  T_axisPos: 0,

  move: function() {
    //this.axis1Pos = 0;
    //this.axis2Pos = 0;
    //this.axis3Pos = 0;
    camera.position.x-=1;
    
  },
  reset: function() {
    this.S_axisPos = 0;
    this.L_axisPos = 0;
    this.U_axisPos = 0;
    this.R_axisPos = 0;
    this.B_axisPos = 0;
    this.T_axisPos = 0;
    
  }
};

//Creating GUI
var gui = new dat.GUI();

var pendant = gui.addFolder('Robot Controls');
pendant.add(options, 'S_axisPos', -3, 3).name('Axis S').listen();
pendant.add(options, 'L_axisPos', -3, 3).name('Axis L').listen();
pendant.add(options, 'U_axisPos', -2, 2).name('Axis U').listen();
pendant.add(options, 'R_axisPos', -3, 3).name('Axis R').listen();
pendant.add(options, 'B_axisPos', -3, 3).name('Axis B').listen();
pendant.add(options, 'T_axisPos', -2, 2).name('Axis T').listen();

pendant.open();

//gui.add(options, 'move');
gui.add(options, 'reset');


function update() {
  control();
  ixMovementUpdate();

}

//Creating Animations
function animate() {
  
  
    requestAnimationFrame( animate );

    update();

    var axis = new THREE.Vector3(0, 10, 0).normalize();
    var speed = 0.01;

  renderer.render( scene, camera );


    SGroup.rotation.y = options.S_axisPos;
    LGroup.rotation.z = options.L_axisPos;
    UGroup.rotation.z = options.U_axisPos;
    RGroup.rotation.x = options.R_axisPos;
    BGroup.rotation.z = options.B_axisPos;
    TGroup.rotation.x = options.T_axisPos;
   
};


//VARIABLES TO ACCESS INDIVIDUAL OBJECT OUT OF THE JSON OBJECT
  var SGroup= new THREE.Mesh();
  var LGroup= new THREE.Mesh();
  var UGroup=new THREE.Mesh();
  var RGroup=new THREE.Mesh();
  var BGroup=new THREE.Mesh();
  var TGroup=new THREE.Mesh();
 
loadJSONModel();


 
function loadJSONModel(){
//Loading the JSON Model of the GP8 Robot Arm.

 

  var GP8Loader = new THREE.ObjectLoader();

  GP8Loader.load("models/GP8_all_json.json", function (robot) {
    //table.position.set(-90, -73, 40);
    //table.scale.set(4, 3, 2);
    scene.add(robot); // Adding the GP8 Robot model to the scene

    ////
    //ACCESSING AN INDIVIDUAL OBJECT OUT OF THE JSON OBJECT///// IT WORKS
    SGroup = robot.getObjectByName( "GP8_S", true );
    LGroup = robot.getObjectByName( "GP8_L", true );
    UGroup = robot.getObjectByName( "GP8_U", true );
    RGroup = robot.getObjectByName( "GP8_R", true );
    BGroup = robot.getObjectByName( "GP8_B", true );
    TGroup = robot.getObjectByName( "GP8_T", true );
    
   

  });


} //end function loadJSONModel




function moveRobot(){
    
    //RobotBase.rotation.y=1.5;
    

    //console.log(RGroup.position);
}



moveRobot();
 animate();
