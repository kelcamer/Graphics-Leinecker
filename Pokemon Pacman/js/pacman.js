	/*
	Kelsey Cameron
	Copyright 2017

	*/
	
	var renderer;
	var scene;
	var camera;
	var spotLight;
	var smsh;
	var sceneHUD;
	//<!-- add objects in the scope so all methods can access -->
	var groundPlane;
	var ball;
	var cameraHUD;
	var maxloop = 30;
	var game;
	var ghostList = [];
	var camerastate = 0;
	var UP = new THREE.Vector3(0, 0, 0.04);
	var LEFT = new THREE.Vector3(-0.005, 0, 0);
	var TOP = new THREE.Vector3(0, 0.005, 0);
	var RIGHT = new THREE.Vector3(0.005, 0, 0);
	var BOTTOM = new THREE.Vector3(0, -0.005, 0);
	//<!-- 3. Add the following two lines. -->
	Physijs.scripts.worker = 'libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
	
	function init()
	{


		
		playerScore = 0;

  
	/*
		 game = [
			'#######################################################',
			'# . . . . . . . . . . . . ### . . . . . . . . . . . . #',
			'# . ####### . ######### . ### . ######### . ####### . #',
			'# . ####### . ######### . ### . ######### . ####### . #',
			'#   ####### . ######### . ### . ######### . ####### o #',
			'# . ####### . ######### . ### . ######### . ####### . #',
			'# . . . . . . . . . . . . . . . . . . . . . . . . . . #',
			'# . ####### . ### . ############### . ### . ####### . #',
			'# . ####### . ### . ############### . ### . ####### . #',
			'# . . . . . . ### . . . . ### . . . . ### . . . . . . #',
			'########### . #########   ###   ######### . ###########',
			'          # . #########   ###   ######### . #          ',
			'          # . ###            P.       ### . #          ',
			'          # . ###   ####### #######   ### . #          ',
			'########### . ###   #             #   ### . ###########',
			'#           .       #             #       .           #',
			'########### . ###   #             #   ### . ###########',
			'          # . ###   ###############   ### . #          ',
			'          # . ###                     ### . #          ',
			'          # . ###   ###############   ### . #          ',
			'########### . ###   ###############   ### . ###########',
			'# . . . . . . . . . . . . # # . . . . . . . . . . . . #',
			'# . ####### . ######### . # # . ######### . ####### . #',
			'# . ####### . ######### . # # . ######### . ####### . #',
			'#   . . ### . . . . . . . .   . . . . . . . ### . .   #',
			'##### . ### . ### . ############### . ### . ### . # # #',
			'##### . ### . ### . ############### . ### . ### . # # #',
			'# . . . . . . ### . . . . ### . . . . ### . . . . . . #',
			'# . ################### . ### . ################### . #',
			'# . ################### . ### . ################### . #',
			'# . . . . . . . . . . . . . . . . . . . . . . . . . . #',
			'#######################################################'
				];
	
	*/
				// 52 dots
	game = [
		'  #  ######### ',
		'##P###. . .  # ',
		'##.# #.#####.# ',
		'##.###.# #. .##',
		'##. . .###.G.##',
		'##.#######.### ',
		'##.#######. .# ',
		'##. .G. .###.# ',
		'##.#####.###.# ',
		'##.#   #. . .# ',
		'##.#####. #### ',
		'##. .G. . . .# ',
		'##.#########.# ',
		'##.# #. . . .##',
		'##.###.G#######',
		'##. . .##      ',
		'  #####        '
	];
		loadSounds();

		document.onkeydown = function(evt) {
			evt = evt || window.event;
			var keyCode = evt.keyCode;
			if (keyCode >= 37 && keyCode <= 40) {
				return false;
			}
		};
		
		scene = new Physijs.Scene();
		scene.setGravity(new THREE.Vector3( 0, 0, -25 ));

	//	setupSpotlight(100,100,0xff0000,1);
		setupCamera();
		setupHUDCamera();
		setupRenderer();
		
		addSpotLight();
		showWord();

		
		



		buildBoard();
		buildBase();
		// sets the z value of gravity.
		
		var container = document.getElementById("MainView");
		container.appendChild( renderer.domElement );

		

	
		render();
	}
	var backgroundMusic;
	var chomp;
	function loadSounds(){
		backgroundMusic = new Audio("music/pokemon.mp3");
		backgroundMusic.play();
		chomp = new Audio("music/pika.mp3");
	}

	function setupHUDCamera(){
	
	}
	function buildBase(){
		var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'white'}), .95, 1 );

		// 10 500 1000
		var geo = new THREE.PlaneGeometry( 35, 60, 1 );
		var square = new Physijs.BoxMesh(geo, mat, 0)
	   
		square.position.x = 15;
		square.position.y = 27;
		square.position.z = -1;
		
		scene.add(square);
		
		return square;
	}
	function buildBoard(){
		var x = 0;
		var y = 0;
		var frame = [];
		var pieces = [];
		for(x = 0; x < game.length; x++){
			for(y = 0; y < game[x].length; y++){
				switch(game[x][y]){
					case '#':
						
						frame.push(addSquare(x,y,-1));
						break;
					case ' ':
						
						break;
					case '.':
						pieces.push(addSmallSquare(x,y,-1));
					
						break;
					case 'P':
						ball = createBall(0.25, x, y, 0);
					
					break;
					case 'o':

					break;
					case 'G':
						ghostList.push(addGhost(x,y,-1));
						
					break;


												
				}

			}
		}


	}
	function createGroundPlane()
	{
		var planeTexture = THREE.ImageUtils.loadTexture('images/groundterrain.jpg');
		
		//                                                                                           friction restitution
		var planeMaterial = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:planeTexture}), .95, 1.5 );
		var planeGeometry = new THREE.PlaneGeometry( 200, 200, 6 );
		groundPlane = new Physijs.BoxMesh( planeGeometry, planeMaterial, 0 );
		groundPlane.name = "GroundPlane";
		
		scene.add( groundPlane );
	}
	function createBall(args)
	{
		var ballGeometry = new THREE.SphereGeometry( arguments[0] );
		var texture = THREE.ImageUtils.loadTexture('images/pokeball2.png');
		var mat = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .95, 0.1 );
		 
		//                                                                                     friction restitution
	//	var ballMaterial = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'white'}), .95, 1.3 );
		var temp = new Physijs.SphereMesh( ballGeometry, mat );
		
		temp.position.x = arguments[1];
		temp.position.y = arguments[2];
		temp.position.z = arguments[3];
		
		temp.name = "ball";
		scene.add( temp );
		return temp;
	}
	
    
   function addSquare(args){
   
	//	var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'white'}), .95, 1.3 );
//	var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'black'}), .95, 1.3 );
		var texture = THREE.ImageUtils.loadTexture('images/pc.png');
		var mat = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .1 );
		
	// 10 500 1000
    var geo = new THREE.BoxGeometry( 1, 1, 4 );
    var square = new Physijs.BoxMesh(geo, mat, 0);
   
	square.position.x = arguments[0];
	square.position.y = arguments[1];
	square.position.z = arguments[2];
	square.name = "square";
    scene.add(square);
    
    return square;
	}
	function addGhost(args){
		var ballGeometry = new THREE.SphereGeometry( 0.2 );
		var texture = THREE.ImageUtils.loadTexture('images/char.png');
		var mat3 = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'white'}), .95, 1.3 );

		//var mat3 = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .95, 0.1 );
		 	   var temp3 = new Physijs.SphereMesh( ballGeometry, mat3 );
	   
	   temp3.position.x = arguments[0];
	   temp3.position.y = arguments[1];
	   temp3.position.z = arguments[2];
	   
	   temp3.name = "ghost";
	   scene.add( temp3 );
	   
	   return temp3;
	}
	

	 
	function addSmallSquare(args){
		
			 var texture = THREE.ImageUtils.loadTexture('images/pikachu.png');
			 var mat = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .1 );
			 
		 // 10 500 1000
		 var geo = new THREE.BoxGeometry( 0.5, 0.5, 1 );
		 var square = new Physijs.BoxMesh(geo, mat, 0);
		
		 square.position.x = arguments[0];
		 square.position.y = arguments[1];
		 square.position.z = arguments[2];
		 square.name = "pika";
		 scene.add(square);
		 
		 return square;
		 }
		
		  
	function addCircle(args){
		
		var ballGeometry = new THREE.SphereGeometry(0.1 );
		 
		//                                                                                     friction restitution
		var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'blue'}), .95, 0.1 );
		var temp2 = new Physijs.SphereMesh( ballGeometry, mat );
		
		temp2.position.x = arguments[0];
		temp2.position.y = arguments[1];
		temp2.position.z = arguments[2];
		
		temp2.name = "ball";
		scene.add( temp2 );
		
		return temp2;
		 }
		 
	function moveGhosts(){
		
		var q = 0;
	
		var leftGhost = new THREE.Vector3(-0.005, 0, 0);
		var upGhost = new THREE.Vector3(0, 0.005, 0);
		var rightGhost = new THREE.Vector3(0.005, 0, 0);
		var downGhost = new THREE.Vector3(0, -0.005, 0);
		
		
		for(q = 0; q < ghostList.length; q++){
			var num = Math.round(Math.random()*4) + 1;
			switch(num){
				case 1:
				// up
				ghostList[q].applyCentralImpulse(upGhost);
				//alert("up");
					break;
				case 2:
				// down
				//alert("down");
				ghostList[q].applyCentralImpulse(downGhost);
					break;
				case 3:
				// left
				ghostList[q].applyCentralImpulse(leftGhost);
					break;
				case 4:
				// right
				ghostList[q].applyCentralImpulse(rightGhost);
					break;
			}


		}


	}


		 var width = window.innerWidth;
		 var height = 1200;
	function render()
	{
		//<!-- 6. Physics simulation -->
		scene.simulate();
		moveGhosts();
		updateScore();
		checkCollisions();
		maintainCannonElevationControls();
		if(!Key.isDown(Key.C)){
			setEqualPositions();
		
		}
		
		requestAnimationFrame( render );
		renderer.setViewport( -600, -400, width/1, height );
		renderer.setScissor(0,0,window.innerWidth,height);
		renderer.enableScissorTest (true); 
		renderer.render( scene, camera2 );
			
		
		renderer.setViewport( -400, -300, window.innerWidth*1.6 , height );
		renderer.setScissor(450,0,800,height);
		renderer.enableScissorTest (true); 
	
		renderer.render(scene, camera);
		
		if(playerScore == 52){
			alert("Congratulations, you've won!! Play again?");
			playerScore = 0;
			init();
		}
	}
	var gameover = 0;
	function checkCollisions(){
		ball.addEventListener( 'collision', function( other_object )
		{
			if(other_object.name == "pika" )
			{
				//if(Math.abs(other_object.position.z - ball.position.z) < 0.5){
				playerScore++;
				chomp.play();
				scene.remove(other_object);
				pieces.remove(other_object);
				//}
			}
		});
		ball.addEventListener('collision', function(object2){
			if(object2.name == 'ghost' && gameover==0){
				if((Math.abs(object2.position.z - ball.position.z) < 0.3)
				 && (Math.abs(object2.position.x - ball.position.x) < 0.5)
				  && (Math.abs(object2.position.y - ball.position.y)) < 0.5){
				alert("Game over! You've been captured by the terrible charizard, and he has burned you to pieces!");
				gameover++;
				init();
				}
			}
		});
		
	}
	function maintainCannonElevationControls()
	{
		
	
		if(Key.isDown(Key.LEFTARROW)){
		 ball.applyCentralImpulse(LEFT);
		 if(camerastate == 1){
		 currentZ = rotateLeft;
		 }
		}
		if(Key.isDown(Key.J)){
			if(ball.position.z <1){
			ball.applyCentralImpulse(UP);
			}
		}
		if(Key.isDown(Key.RIGHTARROW)){
			
			ball.applyCentralImpulse(RIGHT);
			//currentZ = 0;
			if(camerastate == 1){
		currentZ = rotateRight;
			}
		}
		if(Key.isDown(Key.UPARROW)){
			ball.applyCentralImpulse(TOP);
			if(camerastate == 1){
			currentZ = rotateUp;
			}
			
		}
		if(Key.isDown(Key.DOWNARROW)){
			ball.applyCentralImpulse(BOTTOM);
			if(camerastate == 1){
			currentZ = rotateDown;
			}
		}
		
		if(Key.isDown(Key.C)){
			camera.position.x = 0;
			camera.position.y = 4;
			camera.position.z = 50;
			camera.rotation.y = 0;
			camera.rotation.z = 0;
	
		}
		
		if(Key.isDown(Key.B)){
			camerastate = 1;
		}
	}



	var playerScore = 0;

	var scoreObject2;
	function showWord()
	{
		if( scoreObject2 != null )
		{
			scene.remove( scoreObject2);
		}
		
		var scoreString2 = "By:  Kelsey Cameron";
		
		var scoreObjectGeometry2 = new THREE.TextGeometry( scoreString2,
		{
			size: 1,
			height: 0.1, 
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial2 = new THREE.MeshLambertMaterial({color:0x0000F0});
		
		scoreObject2 = new THREE.Mesh( scoreObjectGeometry2, scoreObjectMaterial2 );
		scoreObject2.position.x = 2;
		scoreObject2.position.y = 0;
		scoreObject2.position.z = 2;
		scoreObject2.rotation.x =0;
		scoreObject2.rotation.z = 0;
		scene.add( scoreObject2 );
	}

	/*
	Backwards View
			camera.position.x = ball.position.x;
			camera.position.y = ball.position.y;
			camera.position.z = ball.position.z;
			camera.rotation.y = 1.5;
			camera.rotation.z = 1.4;
	*/
	var camera2;
	function setupCamera()
	{

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.lookAt( scene.position );

		
		camera2 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera2.position.x = 0;
		camera2.position.y = 0;
		camera2.position.z = 45;
		camera2.rotation.y = 0;
		camera2.rotation.z = 0;
	}
	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer({alpha: true});
		renderer.setClearColor( 0x000000, 0 );
		//renderer.setSize( width,height );
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
	
	}
var addz = 0;
var rotateDown = Math.PI;
var rotateRight = -Math.PI/2;
var rotateUp = 0;	
var rotateLeft = Math.PI/2;
var currentZ = rotateUp;
var currentY = 0;
var addposx = 1.5;
	function setEqualPositions(){
	
		
		camera.position.x = ball.position.x;
		camera.position.y = ball.position.y;
		camera.position.z = ball.position.z+8;

		camera.rotation.z = currentZ; 
		camera.rotation.y = currentY;
	
		
	}
	
	
	var scoreObject;
	function updateScore()
	{
		if( scoreObject != null )
		{
			scene.remove( scoreObject);
		}
		
		var scoreString = "Score: " + playerScore;
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 1,
			height: 0.2, 
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0x000000});
		
		scoreObject = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject.position.x = 0;
		scoreObject.position.y = -2;
		scoreObject.position.z = 2;
		scoreObject.rotation.x =0;
		scoreObject.rotation.z = 0;
		scene.add( scoreObject );
	}


	function addSpotLight()
	{
        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 200, 200 );
        spotLight.shadowCameraNear = 100;
        spotLight.shadowCameraFar = 100;
        spotLight.castShadow = true;
		spotLight.intensity = 1.5;

		scene.add(spotLight);
	
	}
	function setupSpotlight(x,z,color,number)
	{
		spotLight = new THREE.SpotLight( color, 12, 300, 1, 0, 0 );
        spotLight.position.set( x, 100, z );
		spotLight.target.position.set( x,0,z);
		spotLight.name = "SpotLight"+number;
        scene.add(spotLight);
	}
	window.onload = init;
