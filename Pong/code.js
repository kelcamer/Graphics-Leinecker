var renderer;
	var scene;
	var camera;
	var cube;               // you
    var cube2;              // opponent
    var leftbackground;
    var rightbackground;
    var cubeGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);                    // creates the geometry of cube
	var cubeGeometry2 = new THREE.BoxGeometry(2, 0.5, 0.5);                    // creates the geometry of cube
    var backCons = new THREE.BoxGeometry(1,5,10);
       
    var cubeMaterial = new THREE.MeshLambertMaterial({color:'#FF0099'});    // pink - sets the material and color
    var cube2Material = new THREE.MeshLambertMaterial({color:'#330066'});   // purple
    var background = new THREE.MeshLambertMaterial({color:'#FF3300'});

    var planeGeometry = new THREE.BoxGeometry( 14,0.25,27);
	var planeMaterial = new THREE.MeshLambertMaterial({color:'#FFFF00'});
	var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    var ball;
	var backgroundMusic;
	var gameover;
	var losingPoint;
	var puh;
	var fightSong;
	var whistle;
	var wall;
    var playerScore = 0;
	var enemyScore = 0;
	function init()
	{
		scene = new THREE.Scene();		// a scene is an area where you can place things.
		initRenderer();
		initCamera();
		createPlayerCube();
		createOpposingCube();
		addBackground();
		addSpotLight();
        createBall();
		showWord();
		//checkWallBoundary();
		// Output to the stream
		loadSounds();
		document.body.appendChild( renderer.domElement );
		
		// Call render
		render();
	}
	function createOpposingCube(){
		cube2 = new THREE.Mesh(cubeGeometry2, cube2Material);                    // creates new object.
        cube2.castShadow = true;
		cube2.position.z = -4;

        scene.add(cube2);
	}
	function createPlayerCube(){
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);                      // actually creates the mesh
		cube.castShadow = true;
        cube.position.z = 5;
		cube.position.y = 0;
		scene.add(cube);
	}
	function initCamera(){

		
		camera = new THREE.PerspectiveCamera(
		// frustum vertical view         aspect ratio							 frustum near plane     frustum far plane
			45,                          window.innerWidth / window.innerHeight, 0.1,                   1000 );

		camera.position.x = 0;			// sets position of camera
		camera.position.y = 10;
		camera.position.z = 10;
		camera.lookAt( scene.position );			// origin is 0,0,0 


	}

	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		//						color     alpha
		renderer.setClearColor( 0x000000, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;

	}
	
	function render()
	{
       
	   
		moveBall();
		moveCube();
		updateScore();
		updateOScore();
		if(Key.isDown(Key.LEFTARROW) && cube.position.x > -3){
			cube.position.x -= 0.2;
		}
		if(Key.isDown(Key.RIGHTARROW) && cube.position.x < 3){
			cube.position.x += 0.2;
		}
	
		// Request animation frame
		requestAnimationFrame( render );
		// Call render()
		renderer.render( scene, camera );
	}
	
	var scoreObject = null;

	function updateScore()
	{
		if( scoreObject != null )
		{
			scene.remove( scoreObject );
		}
		
		var scoreString = "" + playerScore;
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 1,
			height: 0.4,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0xFFFFFF});
		
		scoreObject = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject.position.x = -3;
		scoreObject.position.y = 0;
		scoreObject.position.z = -7;
		scoreObject.rotation.x =0;
		scene.add( scoreObject );
	}

	var scoreObject2 = null;

	function updateOScore()
	{
		if( scoreObject2 != null )
		{
			scene.remove( scoreObject2 );
		}
		
		var scoreString = "" + enemyScore;
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 1,
			height: 0.4,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0xFFFFFF});
		
		scoreObject2 = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject2.position.x = 3;
		scoreObject2.position.y = 0;
		scoreObject2.position.z = -7;
		scoreObject2.rotation.x =0;
		scene.add( scoreObject2 );
	}


	var scoreObject3 = null;

	function showWord()
	{
		
		
		var scoreString = "Pong -  Play to 7 points. ";
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 0.5,
			height: 0.1,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0xFFFFFF});
		
		scoreObject3 = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject3.position.x = -3.6;
		scoreObject3.position.y = 5;
		scoreObject3.position.z = 0;
		scoreObject3.rotation.x =-1;
		scene.add( scoreObject3 );
	}

	function addSpotLight()
	{
		var spotLight;
		spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set(20,20,20);
		spotLight.shadowCameraNear = 10;
		spotLight.shadowCameraFar = 50;
		spotLight.castShadow = true;
		scene.add(spotLight);				
	}
	function createBall(){

        var ballSphere = new THREE.SphereGeometry( .35 );
		var ballMaterial = new THREE.MeshBasicMaterial({color:'#000099'});
		ball = new THREE.Mesh( ballSphere, ballMaterial );

		ball.position.z = 0;

		scene.add( ball );

    }
	var xdir = 0.05;
	var zdir = 0.05;
	function moveBall(){
		if(ball.position.x >3.75 || ball.position.x < -3.75){
			wall.play();
		}
		
		ball.position.x += xdir;
		ball.position.z += zdir;
		
		
		if(ball.position.x > 3.8 || ball.position.x < -3.8){
					
			xdir = -xdir;
		}
	

		// a collision occurs with the ball and the opposing cube
		if((Math.abs(ball.position.z - cube2.position.z) <= 0.8) && (Math.abs(ball.position.x - cube2.position.x) <= 0.9)){
			puh.play();
			if(zdir > 0){
				zdir+=0.01;
			}
			else{
				zdir-=0.01;
			}
			zdir = Math.abs(zdir);

			if((ball.position.x - cube2.position.x ) > -0.01){
				xdir = Math.abs(xdir+0.01);
				
					
			}
			else{
				xdir = -1*Math.abs(Math.abs(xdir)+0.01);
			
			}
			

		}

		// a collision occurs between your cube and the ball
		
		if((Math.abs(ball.position.z - cube.position.z) <= 0.8) && (Math.abs(ball.position.x - cube.position.x) <= 0.8)){
			puh.play();
			if(zdir > 0){
				zdir+=0.01;
			}
			else{
				zdir-=0.01;
			}
			zdir = -1*Math.abs(zdir);
			if((ball.position.x - cube.position.x ) > -0.01){
				xdir = Math.abs(xdir+0.01);
				
			}
			else{
				xdir = -1*Math.abs(Math.abs(xdir)+0.01);
				
			}
			
		}
		
		if((ball.position.z > 8)){
			enemyScore+=1;
			losingPoint.play()
			ball.position.x = 0;
			ball.position.z = 0;
			xdir = 0.05;
			zdir = 0.05;
			cube.position.z = 5;
			cube.position.x = 0;
			cube2.position.z = -5;
			cube2.position.x = 0;
			
		}
		if((ball.position.z < -8)){
			
			playerScore+=1;
			
			whistle.play()
			ball.position.x = 0;
			ball.position.z = 0;
			xdir = 0.05;
			zdir = -0.05;
			cube.position.z = 5;
			cube.position.x = 0;
			cube2.position.z = -5;
			cube2.position.x = 0;
		}

		if(enemyScore == 7){
		
			gameover.play();
			alert("Game over! You lose :( Play again?");
			playerScore = 0;
			enemyScore = 0;
		}
		if(playerScore == 7){
			fightSong.play();
			alert("You won, great job! Play again?");
			playerScore = 0;
			enemyScore = 0;
		}
		
		
		
	}
	// y controls in and out of the board.
	// z controls up down onscreen
	// x controls left right
	var xdir2 = 0.07;
	function moveCube(){
		
		cube2.position.x+=xdir2;
		if(cube2.position.x > 3.3 || cube2.position.x < -3.3){
			xdir2 = -xdir2;
		}
		else{
			
			if((cube2.position.x - ball.position.x) > 0){

				xdir2 = -1*Math.abs(xdir2);
			}
			else{
				xdir2 = Math.abs(xdir2);
			}

			
		}
	
	}
	
	function loadSounds(){
		backgroundMusic = new Audio("spikyroad.m4a");
		backgroundMusic.play();

		gameover = new Audio("game_over.m4a");
		losingPoint = new Audio("losing_point.m4a");
		puh = new Audio("1.mp3");
		fightSong = new Audio("fightsong.m4a");
		wall = new Audio("2.mp3");
		whistle = new Audio("whistle.m4a");
		
	}
	function addBackground()
	{

        leftbackground = new THREE.Mesh(backCons, background);
        rightbackground = new THREE.Mesh(backCons, background);


        var edgeHelp1 = new THREE.EdgesHelper(leftbackground, 0x000000);
        var edgeHelp2 = new THREE.EdgesHelper(rightbackground, 0xFFFFFF);
        var edgeHelp3 = new THREE.EdgesHelper(cube2, 0x9900CC);

        leftbackground.position.x = -5;
        rightbackground.position.x = 5;
	    plane.position.y = -10;


        scene.add(leftbackground);
        scene.add(rightbackground);
        scene.add(edgeHelp1);
        scene.add(edgeHelp2);
        scene.add(edgeHelp3);
        scene.add(plane);
	}

	window.onload = init;	// this calls the initialization function.