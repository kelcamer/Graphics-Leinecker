	/*
	Kelsey Cameron
	Copyright 2017

	*/
	
	var renderer;
	var scene;
	var spotLight;
	var game ;
	var frame = new Array(10);
	//var board = new [10][10];
	var support = [];
	var friction = 1.2;
	var mass = 0.1;
	
	var base;
	var hammerStrength = -20;
	var zDOWN = new THREE.Vector3(0, 0, hammerStrength);

	var raycaster = new THREE.Raycaster();
	var projector = new THREE.Projector();
	var LEFT = new THREE.Vector3(0, 0, 0);
	var UP = new THREE.Vector3(0, 0.005, 0);
	var zero = new THREE.Vector3(0, 0, 0);
	
	var RIGHT = new THREE.Vector3(0.005, 0, 0);
	var DOWN = new THREE.Vector3(0, -5, 0);
	var mouse = new THREE.Vector2();
	var zUP = new THREE.Vector3(0, 0, 0.005);
	

	Physijs.scripts.worker = 'libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
	
	function init()
	{

		// board starts at (1,1,20)
		// Therefore supports must be from (0,0,20) to (0,7,20)
				// 52 dots
	game = [
		'M######M',  // 0
		'#ssssss#',  // 1
		'#ssssss#',  // 2
		'#ssssss#',  // 3
		'#ssssss#',  // 4
		'#ssssss#',  // 5
		'#ssssss#',  // 6
		'M######M',  // 7
		
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
		
		scene.setGravity(new THREE.Vector3( 0, 0, -3));

	
		setupCamera();
		setupRenderer();
		
		addSpotLight();
	
		buildBoard();
		showWord();
		updateScore();
		// base = buildBase();


				//		middleSquare = addCorner(3.5,3.5,22,mass,2,2,1);

		
		
		var container = document.getElementById("MainView");
		container.appendChild( renderer.domElement );


		
		renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		
		
		render();
	}

	var uniforms3;
	function addShader(){

		var vShader3 = 
		'\nuniform float delta2;varying vec3 vUv;\n' + 
		'varying vec3 vColor;\n'+
		
		'void main()\n'+
		'{ \n'+
		'vColor = position;\n'+
		
		'	gl_Position = projectionMatrix * \n'+
		'		modelViewMatrix * \n'+
		'		vec4(position,1.0); \n'+
		'} \n'+
		'\n';
		
		var fShader3 =
		'\n' + 
		'uniform float red; \n'+
		'uniform float green; \n'+
		'uniform float blue; \n'+
		'uniform float delta2; \n' + 
		'varying vec3 vColor;\n'+
		'void main()  \n'+
		'{ \n'+
		'	gl_FragColor = vec4(sin(tan(red*vColor.x*delta2)), \n'+
		'						sin(tan(red*vColor.y*delta2)), \n'+
		'						sin(tan(red*vColor.z*delta2)), \n'+
		'						1.0); \n'+
		'} \n'+
		'\n';

		 uniforms3 = {
			 red: {type: 'f', value: 1.0 }, 
			 green: {type: 'f', value: 1.0 }, 
			 blue: {type: 'f', value: 1.0 }, 
			 delta2: {type: 'f', value: 0.0 }, 
			}
		
	
				var mat = new THREE.ShaderMaterial({uniforms:uniforms3,vertexShader:vShader3,fragmentShader:fShader3});
	/// Shader
	
		        	var mat2 = Physijs.createMaterial(mat, friction, 0 );
	
        
                 // 10 500 1000
                 var geo = new THREE.BoxGeometry( arguments[4], arguments[5], arguments[6] );
				 var square = new Physijs.BoxMesh(geo, mat2, arguments[3])
				 

		 square.position.x = arguments[0];
		 square.position.y = arguments[1];
		 square.position.z = arguments[2];
	 
		 
		 square.name = "square" + arguments[0] + arguments[1];
		 scene.add(square);

		 
		return square;



	}
	var boardCreated = 0;
	function checkKeys(){
		
		if(Key.isDown(Key.D)){
			camera2.position.x = 0;
			camera2.position.y = 0;
			camera2.position.z = 45;
			camera2.rotation.y = 0;
			camera2.rotation.x = 0;
			camera2.rotation.z = 0;
			
			
		}
		if(Key.isDown(Key.C)){
			
			camera2.rotation.x = Math.PI/2;
			camera2.position.y = -50;
			camera2.position.z = 5;

			
		}
		if(Key.isDown(Key.Y)){
			$( "#dialog" ).dialog();
			
		}
		if(Key.isDown(Key.N)){
			camera2.rotation.x+=0.2;
		}

	}
	var backgroundMusic;
	var chomp;
	function loadSounds(){
		backgroundMusic = new Audio("music/song.mp3");
		backgroundMusic.play();
	}

	
	function buildBase(){
		var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'black'}), .95, 1 );

		// 10 500 1000
		var geo = new THREE.PlaneGeometry( 100, 100, 10 );
		var square = new Physijs.BoxMesh(geo, mat, 0)
	   
		square.position.x = 0;
		square.position.y = 0;
		square.position.z = 0;
		square.name = "base";
		scene.add(square);
		
		return square;
	}

	var corners = [];
	var middleSquare;
	// distance of 10 for board from base.
	function buildBoard(){
		var x = 0;
		var y = 0;
		
		var pieces = [];
		for(x = 0; x < game.length; x++){
			frame[x] = new Array(10);
			for(y = 0; y < game[x].length; y++){
				switch(game[x][y]){
					case 's':
						//if(x == 3 )
						frame[x][y] = addSquare(x,y,22), mass, 0x00FFFF;
						break;
					case '#':
						
				
					

					break;


												
				}

			}
		}

		// x, y, z, mass, lengthx, lengthy, lengthz
		corners.push(addCorner(0,1,12, 0, 1, 1, 20));
		corners.push(addCorner(0,7,12, 0, 1, 1, 20));
		corners.push(addCorner(7,0,12, 0, 1, 1, 20));
		corners.push(addCorner(7,7,12, 0, 1, 1, 20));



				// x, y, z, mass, lengthx, lengthy, lengthz

		
				// top and bottom
		support.push(addCorner(3.5,7.00,22, 0, 6, 1, 1));
		support.push(addCorner(3.5,0,22, 0, 6, 1.05, 1));


		// right and left
		support.push(addCorner(7,3.5,22, 0, 8, 1.05, 1));
		support.push(addCorner(0,3.5,22, 0, 8, 1, 1));
		
		middleSquare = addShader(3.5,3.5,22,mass,2,2,1);
		middleSquare.name = "middleSquare";


		

	}
	var randomX;
	var randomY;
	function getRandomSquare(){



		randomX = Math.round(Math.random() * (5) + 1);
		randomY = Math.round(Math.random() * (5) + 1);

		while((randomX == 3 || randomX == 4) && (randomY == 3 || randomY == 4)){
			randomX = Math.round(Math.random() * (5) + 1);
			randomY = Math.round(Math.random() * (5) + 1);
	
		}
		while(frame[randomX][randomY] == null){
			randomX = Math.round(Math.random() * (5) + 1);
			randomY = Math.round(Math.random() * (5) + 1);
		}
	//	alert("The computer has chosen (" + randomX + ", " + randomY + ")");
		
		frame[randomX][randomY].applyCentralImpulse(zDOWN);
		if(frame[randomX][randomY].position.z > 10){
			frame[randomX][randomY].applyCentralImpulse(zDOWN);
			
		}
		frame[randomX][randomY].setAngularVelocity(new THREE.Vector3(0, 0, 0));
		
		
	}
	function addCorner(args){
		
		
		
		 // friction first then restitution

		 var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:0x00BFFF}), 1.4, 0 );
		 
	 
		 var geo = new THREE.BoxGeometry( arguments[4],arguments[5], arguments[6] );
		 // if this value is set to 0, you create a massless static object!

		 var square = new Physijs.BoxMesh(geo, mat, arguments[3]);
		
		 square.position.x = arguments[0];
		 square.position.y = arguments[1];
		 square.position.z = arguments[2];
		 square.name = "square";
		 if(arguments[4] == 8 && ((arguments[5] - 1) < 0.1) && arguments[6] == 1 && (arguments[0] == 7 || arguments[0] == 0)){

			square.rotation.z = Math.PI/2;
		}
		 scene.add(square);
		 
		 return square;
		 }
   function addSquare(args){
   
	if((arguments[0] == 3 && arguments[1] == 3) || (arguments[0] == 3 && arguments[1] == 4) || (arguments[0] == 4 && arguments[1] == 3) || (arguments[0] == 4 && arguments[1] == 4)){
		return;
	}

	// friction first then restitution
	var path = "images/" + "ice" + ".jpg";
	var texture = THREE.ImageUtils.loadTexture(path);
	var mat2 = Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), friction, 0 );
		
	var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:arguments[4]}), friction, 0 );
	

	var geo = new THREE.BoxGeometry( 1,1, 1 );
	// if this value is set to 0, you create a massless static object!
    var square = new Physijs.BoxMesh(geo, mat2, arguments[3]);
   
	square.position.x = arguments[0];
	square.position.y = arguments[1];
	square.position.z = arguments[2];

	
	square.name = "square" + arguments[0] + arguments[1];
    scene.add(square);
    
    return square;
	}
	
	var players = 1;
	function updatePlayers(){
		players =  $("input[name='numberPlayers']:checked"). val();

	}


		 var width = window.innerWidth;
		 var height = 1200;
		 var count = 0;
	function render()
	{
		
		scene.simulate();
		updatePlayers();
		if((endTime - beginTime) > 3000){
			nextPlayer();
		}
		
		endTime = new Date().getTime();
		
			
		updateScore();
		checkWinner();
		checkKeys();
		if($('input[name=slider]').val() < 0){
			hammerStrength = $('input[name=slider]').val();
		}
	
		boardCreated = 1;


		if(count < 10){
			uniforms3.delta2.value+=0.1;
		}
		else if(count < 20){
			uniforms3.delta2.value-=0.1;
		}
		else{
			count = 0;
		}
		
		renderer.render( scene, camera2 );
		
		requestAnimationFrame( render );
		
		
		
	}
	var endGame = 0;
	function checkWinner(){
		if(middleSquare.position.z < 21 && endGame == 0){
			if(state == 0){
				alert("Player " + (state+1) + " has won the game!\n Sorry, Player " + "2" + ", you loose!");				
				
			}
			else{
				alert("Player " + (state+1) + " has won the game!\n Sorry, Player " + state + ", you loose!");				
				
			}
			endGame = 1;
			
		}


	}

	
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	  }
	var gameover = 0;
	function checkCollisions(){
	//	if(boardCreated == 1){
			for(var p = 1; p < 7; p++){
				for(var q = 1; q < 7; q++){
					if(frame[p][q] != null){
						if(frame[p][q].position.z < 2){
							scene.remove(frame[p][q]);
							frame[p][q] = null;
						}
					}
				}
	
			}
	//	}
		
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
			size: 0.6,
			height: 0.1, 
			curveSegments: 10,
			bevelEnabled: false
		});

		var scoreObjectMaterial2 = new THREE.MeshLambertMaterial({color:0x00BFFF});
		
		scoreObject2 = new THREE.Mesh( scoreObjectGeometry2, scoreObjectMaterial2 );
		scoreObject2.position.x = 0;
		scoreObject2.position.y = -2;
		scoreObject2.position.z = 28;
		scoreObject2.rotation.x =0;
		scoreObject2.rotation.z = 0;
		scene.add( scoreObject2 );
	}


	var camera2;
	function setupCamera()
	{

		
		camera2 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera2.position.x = 0;
		camera2.position.y = 0;
		camera2.position.z = 45;
		camera2.rotation.y = 0;
		camera2.rotation.z = 0;
	}
	
	function setupRenderer()
	{
		//renderer = new THREE.WebGLRenderer();
		renderer = new THREE.WebGLRenderer({alpha: true});
		//renderer.setClearColor( 0xCCCCCC, 0 );
		//renderer.setSize( width,height );
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
	
	}

	
	var scoreObject;
	function updateScore()
	{
		if( scoreObject != null )
		{
			scene.remove( scoreObject);
		}
		
		var scoreString = "Player " + (state + 1) 
		+ "'s Turn!";
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 0.5,
			height: 0.2, 
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0x000000});
		
		scoreObject = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject.position.x = 0.75;
		scoreObject.position.y = 6;
		scoreObject.position.z = 27;
		scoreObject.rotation.x =0;
		scoreObject.rotation.z = 0;
		scene.add( scoreObject );
	}

	function onDocumentMouseMove( event ) 
	{
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1.05;
		
		mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
		

		if( selectedobject != null )
		{
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera2 );
			raycaster.set( camera2.position, vector.sub( camera2.position ).normalize() );
		
			var intersects = raycaster.intersectObject( scene.children );
			selectedobject.position.copy( intersects[0].point );

		}
		
	}

	var x,y,z;
	var counts = 0;
	var projector;
	var raycaster;
	var state = 0;
	var beginTime = 0;
	var endTime = 0;
	var d = new Date();
	function onDocumentMouseDown( event ) 
	{
		beginTime = new Date().getTime();
		
		event.preventDefault();

		if(state == 0 || players == 2){
		// creates a new vector based on mouse position
		var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );

		// resets the projector and directs the camera to mouse pointer location.
		projector.unprojectVector( vector, camera2 );
		
		// changes the raycaster position to where ever the camera is.
		raycaster.set( camera2.position, vector.sub( camera2.position ).normalize() );
		
		// check to see if any objects are intersection with the ray
		var intersects = raycaster.intersectObjects( scene.children, true );
		
		if (intersects.length > 0 )
		{
			for( var i=0; i<intersects.length; i++ )
			{
				// get each object out of the intersects array
				var obj = intersects[i].object;
			
				// get the name
				var name = obj.name;
				var test = "square";

				for(var p = 0; p < 7; p++){
					for(var q = 0; q < 7; q++){
						test = "square" + p + q;

						if(name.includes(test) && !name.includes("middleSquare")){
							obj.applyCentralImpulse(zDOWN);
							if(obj.position.z > 21){
								obj.applyCentralImpulse(zDOWN);
								
							}
							obj.setAngularVelocity(new THREE.Vector3(0, 0, 0));
							
							
							state = 1;
							
							break;
						}

					
				}
				}
				
				

				}
				
								
				
		}		
	}

	checkCollisions();
	
	}
	var current = 1;
	var end = 0;
	function nextPlayer(){
		

				
					if(end!=1){
		
					var c = current-1;

					 if(state == 1){
						 

						if(players == 1){
						getRandomSquare();
						}
						state = 0;
					}
				
		
				}
				
				
				
			}
	var selectedobject;
	function onDocumentMouseUp( event ) 
	{
		event.preventDefault();
		
		if( selectedobject != null )
		{
			selectedobject.position.x = x;
			selectedobject.position.y = y;
			selectedobject.position.z = z;
			selectedobject = null;
		}

	}


	function addSpotLight()
	{
        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 200, 200 );
        spotLight.shadowCameraNear = 100;
        spotLight.shadowCameraFar = 100;
        spotLight.castShadow = true;
		spotLight.intensity = 2;

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
