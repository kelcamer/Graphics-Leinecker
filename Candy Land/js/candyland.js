	/*
	Kelsey Cameron
	Copyright 2017


	1) Add raycaster object.
	2) Allow selection of players.
	3) Allow user to click on the object for a message to pop up telling them which place they are in.
	5) Add second camera angles?
	6) Add candy?
	7) Add sound effects?

	*/
	
	var renderer;
	var scene;
	var end = 0;
	var markedAll = [];
	var camera;
	var spotLight;
	
	var game;
	var randomCard;
	var frame = [];
	var camerastate = 0;
	var cards = [];
	var redCount = 0;
	var orangeCount = 0;
	var yellowCount = 0;
	var greenCount = 0;
	var blueCount = 0;
	var purpleCount = 0;
	var pinkCount = 0;
	var numberMeanings = [];
	var choco = new THREE.MeshLambertMaterial({ color: 0xD2691E });
	var pink = new THREE.MeshLambertMaterial({ color: 0xE67E22 });
	var purple = new THREE.MeshLambertMaterial({ color: 0x9C27B0 });
	var lime = new THREE.MeshLambertMaterial({ color: 0x76FF03 });
	var burly = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
	var orange = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
	var golden = new THREE.MeshLambertMaterial({ color: 0xDAA520 });
	var brown = new THREE.MeshLambertMaterial({ color: 0xA52A2A });
	
	var maroon = new THREE.MeshLambertMaterial({ color: 0x800000 });
	var lightblue = new THREE.MeshLambertMaterial({ color: 0xe6ffff });
	
	
	var mouse = new THREE.Vector2();
	var selectedobject = null;
	
	var raycaster = new THREE.Raycaster();
	var projector = new THREE.Projector();
	
	var pieceList = [null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null];

	var piecesToLoad = ['Rook','Knight','Bishop','King','Queen','Bishop','Knight','Rook'];

	function init()
	{
		
		/*
		R = Red
		O = Orange
		Y = Yellow
		G = Green
		B = Blue
		P = Purple
		K = Pink
		S = Shortcut
		| = CONNECTION NOT SHOWN ON BOARD
		E = End
		I = Start
		NOTE: Every square has a color, but a short cut needs to 
		look different from the other squares.  

		Square with a dot = licorice space = lose one turn
		*/
	game = [
		
	   
		'                                   ',	//0
		'               E                   ',	//1
		'       KGRPYBOGR                   ',	//2
		'       O                           ',	//3
		'       B                           ',	//4
		' YBOGRPY                           ',	//5
		' P                                 ',	//6
		' RGOBYPRGOBYPRGOBYPRGOK            ',	//7
		'     ||               B            ',	//8
		'     |                Y            ',	//9   // y = 21
		'     |                P            ',	//10
		'     |     PYBOGRPYBOGR            ',	//11
		'     |     R                       ',	//12
		'     |     GOBYPRG                 ',	//13
		'     |           O                 ',	//14
		'     |           K                 ',	//15
		'IRPYBOGRPKYBOGRPYB                 '	//16
	
		/*
		I will use a floodfill to navigate to the next squares.
		*/

	];
		

	numberMeanings = [
		'',
		'Red',
		'Orange',
		'Yellow',
		'Green',
		'Blue',
		'Purple',
		'Pink',
		'Red Red',
		'Orange Orange',
		'Yellow Yellow',
		'Green Green',
		'Blue Blue',
		'Purple Purple',
		'Pink Pink'
	];
		initializeCards();

		document.onkeydown = function(evt) {
			evt = evt || window.event;
			var keyCode = evt.keyCode;
			if (keyCode >= 37 && keyCode <= 40) {
				return false;
			}
		};
		
		scene = new THREE.Scene();
	
		//setupSpotlight(100,100,0xff0000,1);
		setupCamera();
		setupRenderer();
		addSpotLight();
		loadSounds();
	

	
		initializeLostTurn();
		addCandyLandLogo();
		showWord();
		buildBoard();
		
	
		showCurrentPlayer();		
		var container = document.getElementById("MainView");
		container.appendChild( renderer.domElement );
		renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		
		render();
	}
	

	function loadPiece(name, x, y, z, index)
	{
		var oLoader = new THREE.OBJMTLLoader();
		
			oLoader.load('models/' + name + '.obj', 'models/'+ name + '.mtl',
			 function(object) {

 				object.position.x = x;
		 		object.position.y = y;
 				object.position.z = z;

  			object.scale.set(0.2, 0.2, 0.2);
	  		players[index] = object;
  			scene.add(object);
			});
	
	}
	function loadObjPiece(name, x, y, z, index){

// prepare loader and load the model
		var oLoader = new THREE.OBJLoader();
		var stringName = "horse" + index;
		oLoader.load('models/' + name + '.obj',
		 function(object, materials) {
			
			var material2;
		
			// sets horse colors
			switch(index){
				case 0:
					material2 = maroon;
					break;
				case 1:
					material2 = burly;
					break;
				case 2:
					material2 = golden;
					break;
				case 3:
					material2 = brown;
				break;
	
			}


  		object.traverse( function(child) {

		if (child instanceof THREE.Mesh) {

			child.material = material2;
 			child.castShadow = true;
			child.receiveShadow = true;

			// sets the appropriate name
			child.name = stringName;
	}

  });
  	  object.scale.set(0.25, 0.25, 0.25);
	  object.rotation.x = Math.PI/2;
	  object.rotation.y = Math.PI;
	  object.position.x = x;
	  object.position.y = y;
	  object.position.z = z;
	  players[index] = object;
	  scene.add(object);


});

	}
	
		


	
	function initializeLostTurn(){
		for(var c = 0; c < numberOfPlayers; c++){
			playerLoseTurn[c] = 0;
		}
	}

	function movePlayer(player, marked, index){

		if(player.position.x == 16 && player.position.y == 0){
			getRandomCard();
			marked = initMarked(marked);
			traverseBackwards(player, marked, index);
		}
		else{
			getRandomCard();
			traverseBackwards(player, marked, index);
		}
		return marked;
		
	}

	var players = [null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null];

	function addPlayer(){
		
		 // eagle is ok scaled 1,1,1
		 // duck is awesome, scaled 2,2,2
		 // horse is awesome, scaled 0.25,0.25,0.25
		 numberOfPlayers = $("input[name='numberPlayers']:checked"). val();
		
		 for(var c = 0; c < numberOfPlayers; c++){
			
			loadObjPiece("horse", 16,0,1,c);
			//players[c].name = "horse";
		 }
		
		 
	}
	var current = 1;	// initialize this depending on nextplayer
	
	function nextPlayer(){

			if(end!=1){

			var c = current-1;
			if(end == 0){
				if(playerLoseTurn[c] != 1){
					markedAll[c] = movePlayer(players[c], markedAll[c], c);
					
				}
				else{
					alert( "Oh no! You've fallen down a licorice hole, and lost a turn!");
					playerLoseTurn[c] = 0;
					
				}
				
				current++;
				if(current-1 == numberOfPlayers){
					current = 1;
				}
			}
		

		}
		
		
		
	}
	function initializeCards(){
		var z = 0;
		for(z =0; z < 15; z++){
			cards[z] = z;
		}
		

		/*
		1	= Red
		2	= Orange
		3	= Yellow
		4	= Green
		5	= Blue
		6	= Purple
		7	= Pink
		8	= Red Red
		9	= Orange Orange
		10	= Yellow Yellow
		11	= Green Green
		12	= Blue Blue
		13	= Purple Purple
		14	= Pink Pink




		*/
	}
	function getRandomCard(){
	//	randomCard = 9;

		randomCard = Math.round(Math.random() * (13) + 1);
		//alert(randomCard);
		alert("Your card is " + numberMeanings[randomCard] +  ".");
	
	}
	var backgroundMusic;

	function loadSounds(){
		backgroundMusic = new Audio("music/egg.mp3");
		backgroundMusic.play();
		
	}

	// for names, check if it's either orange or orange_dot
	function buildBoard(){
		var x = 0;
		var y = 0;
		
		var pieces = [];
		for(x = 0; x < game.length; x++){
			frame[x] = [];
			for(y = 0; y < game[x].length; y++){
				switch(game[x][y]){
					case 'R':
						if(x == 7 && y == 13){
							frame[x][y] = addSmallSquare(x,y,0,"red_dot");							
						}
						else{
							
							frame[x][y] = addSmallSquare(x,y,0,"red");
						}

						break;
					case 'O':
						
					if(x == 16 && y == 12){
						frame[x][y] = addSmallSquare(x,y,0.1, "orange_dot");
					}	
					else{
						frame[x][y] = addSmallSquare(x,y,0,"orange");
					}
						break;
					case 'Y':
						if(x == 9 && y == 22){
							frame[x][y] = addSmallSquare(x,y,0,"yellow_dot");							
						}
						else{
							frame[x][y] = addSmallSquare(x,y,0,"yellow");
						}
						break;
					case 'G':
						if(x == 2 && y == 8){
							frame[x][y] = addSmallSquare(x,y,0,"green_dot");
							
						}
						else{
							frame[x][y] = addSmallSquare(x,y,0,"green");
						}
					break;
					case 'B':
						frame[x][y] = addSmallSquare(x,y,0,"blue");
					break;
					case 'P':
						frame[x][y] = addSmallSquare(x,y,0,"purple");
					break;
					case 'K':
						frame[x][y] = addSmallSquare(x,y,0,"pink");
					break;
					case 'E':
						frame[x][y] = addSmallSquare(x,y,0,"end");
					break;
					case 'I':
						frame[x][y] = addSmallSquare(x,y,0,"start");
					break;
				}

			}
		}


	}

	function initMarked(marked2){
		 marked2 = new Array(50);
		for (var i = 0; i < 50; i++) {
		  marked2[i] = new Array(50);
		  for(var j = 0; j < 50; j++){
			marked2[i][j] = 0;
		  }
		}
		return marked2;
	}
	function traverseBackwards(player, marked, index){
		
		// must have a marking mechanism
		
		var sideways =	 [0, 0, 1, -1];
		var up = [-1, 1, 0, 0];

		
		var p = player.position.x;
		
		var q = player.position.y;
		marked[p][q] = 1;
		var xdir = player.position.x;
		var ydir = player.position.y;

		while(p>=0){
			while(q <= game[p].length){

				var currentX = p;
				var currentY = q;
		// 0,0 searches 0,-1, 0,1,  1,0,  -1,0
			for(x = 0; x < up.length; x++){

					xdir = currentX + up[x];
					ydir = currentY + sideways[x];
					

					
					if(xdir >=0 && ydir>=0 && xdir <=game.length-1 && ydir <=game[0].length-1){
				

						if(marked[xdir][ydir]!=1){
							
							

							if((game[xdir][ydir] == 'R' ||
								game[xdir][ydir] == 'O' ||
								game[xdir][ydir] == 'Y' ||
								game[xdir][ydir] == 'G' ||
								game[xdir][ydir] == 'B' ||
								game[xdir][ydir] == 'P' ||
								game[xdir][ydir] == 'K')){
							


									switch(randomCard){
										case 1:
											if(game[xdir][ydir] == 'R'){
												// move player to this location.
												player.position.x = xdir;
												player.position.y = ydir;
																					checkLostTurns(xdir, ydir, index);  return;
											}
											
											break;
										case 2:
											if(game[xdir][ydir] == 'O'){
											// move player to this location.
												player.position.x = xdir;
												player.position.y = ydir;
												
																					checkLostTurns(xdir, ydir, index);  return;
											}
											
											break;
										case 3:
										if(game[xdir][ydir] == 'Y'){
										// move player to this location.
										player.position.x = xdir;
										player.position.y = ydir;
										
																			checkLostTurns(xdir, ydir, index);  return;
										}

										
											break;
										case 4:
										if(game[xdir][ydir] == 'G'){
										// move player to this location.
										player.position.x = xdir;
										player.position.y = ydir;
										
																			checkLostTurns(xdir, ydir, index);  return;
										}

											
											break;
										case 5:
										if(game[xdir][ydir] == 'B'){
										// move player to this location.
										player.position.x = xdir;
										player.position.y = ydir;
										
																			checkLostTurns(xdir, ydir, index);  return;
										}

										
											break;
										case 6:
										if(game[xdir][ydir] == 'P'){
										// move player to this location.
										player.position.x = xdir;
										player.position.y = ydir;
										
																			checkLostTurns(xdir, ydir, index);  return;
										}

											
											break;
										case 7:
										if(game[xdir][ydir] == 'K'){
										// move player to this location.
										player.position.x = xdir;
										player.position.y = ydir;
										
																			checkLostTurns(xdir, ydir, index);  return;
										}
											break;
										case 8:
										if(game[xdir][ydir] == 'R'){
											redCount++;
											
											if(redCount == 2){
											// move player to this location.
											player.position.x = xdir;
											player.position.y = ydir;
											
											redCount = 0;
																				checkLostTurns(xdir, ydir, index);  return;
											}
											
										}
											
											break;
										case 9:

											if(game[xdir][ydir] == 'O'){
											orangeCount++;
											
											if(orangeCount == 2){
											// move player to this location.
											player.position.x = xdir;
											player.position.y = ydir;
											
											orangeCount = 0;
																				checkLostTurns(xdir, ydir, index);  return;
											}
											
										}
											break;
										case 10:
										if(game[xdir][ydir] == 'Y'){
											yellowCount++;
											
											if(yellowCount == 2){
											// move player to this location.
											player.position.x = xdir;
											player.position.y = ydir;
											yellowCount = 0;
											
																				checkLostTurns(xdir, ydir, index);  return;
											}
											
										}
											break;
										case 11:

											if(game[xdir][ydir] == 'G'){
											greenCount++;
											
											if(greenCount == 2){
											// move player to this location.
											player.position.x = xdir;
											player.position.y = ydir;
											
											greenCount = 0;
																				checkLostTurns(xdir, ydir, index);  return;
											}
											
										}
											break;
										case 12:
										if(game[xdir][ydir] == 'B'){
											blueCount++;
											
											if(blueCount == 2){
											// move player to this location.
											player.position.x = xdir;
											player.position.y = ydir;
											
											blueCount = 0;
																				checkLostTurns(xdir, ydir, index);  return;
											}
											
										}
											break;
										case 13:
										if(game[xdir][ydir] == 'P'){
											purpleCount++;
											
											if(purpleCount == 2){
											// move player to this location.
											player.position.x = xdir;
											player.position.y = ydir;
											purpleCount = 0;
											
																				checkLostTurns(xdir, ydir, index);  return;
											}
											
										}
											break;
										case 14:

											if(game[xdir][ydir] == 'K'){
											pinkCount++;
											
											if(pinkCount == 2){
											// move player to this location.
											player.position.x = xdir;
											player.position.y = ydir;
											
											pinkCount = 0;
																				checkLostTurns(xdir, ydir, index);  return;
											}
											
										}
											break;
										
									}








								p = xdir;
								q = ydir;
								marked[xdir][ydir] = 1;
							
						
						
						}
												}


						if(game[xdir][ydir] == 'E'){
							// stop searching when end is found
							end = 1;
							player.position.x = xdir;
							player.position.y = ydir;

							alert("Congratulations, player " + (index+1) + "! You have won the game!");
							return;
						}

					}

					
				
				
			
		}
	}
	}

	}
	var numberOfPlayers = 0;
	

	function addSmallSquare(xpos,ypos,zpos,name){

		var path = "images/" + name + ".jpg";
		 var texture = THREE.ImageUtils.loadTexture(path);
		 var mat = new THREE.MeshLambertMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .1 );
			 
		 // 10 500 1000
		 var geo = new THREE.BoxGeometry( 1, 1, 1 );
		 var square = new THREE.Mesh(geo, mat);
		 square.castShadow = true;
		 square.position.x = xpos;
		 square.position.y = ypos;
		 square.position.z = zpos;
		 square.name = name;
		 scene.add(square);
		 
		 return square;
		 }
		 function addCandyLandLogo(){
			
					var path = "images/" + "candyland" + ".jpg";
					 var texture = THREE.ImageUtils.loadTexture(path);
					 var mat = new THREE.MeshLambertMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .1 );
						 
					 // 10 500 1000
					 var geo = new THREE.BoxGeometry( 10, 4, 1 );
					 var square = new THREE.Mesh(geo, mat);
					 square.castShadow = true;
					 square.position.x = 3;
					 square.position.y = 22;
					 square.position.z = 0;
					 square.rotation.z = Math.PI/2;
					 square.rotation.y = 0.8;
					 square.name = "logo";
					 scene.add(square);
					 
					 
					 }
					
		  
	
	/*	 function addNewPlayer(xpos,ypos,zpos,name){
		
			// insert here
					var path = "images/" + name + ".jpg";
					 var texture = THREE.ImageUtils.loadTexture(path);
					 var mat = new THREE.MeshLambertMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .1 );
						 
					 // 10 500 1000
					 var geo = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
					 var square = new THREE.Mesh(geo, mat);
					 square.castShadow = true;
					 square.position.x = xpos;
					 square.position.y = ypos;
					 square.position.z = zpos;
					 square.name = name;
					 scene.add(square);
					 
					 return square;
					 }

*/
		 var width = window.innerWidth;
		 var height = 1200;
	function render()
	{

		changeCamera();
		showCurrentPlayer();
		requestAnimationFrame( render );
		
		renderer.render( scene, camera );
		
	}
	function checkEqualPositions(){
		for(var q = 0; q < numberOfPlayers; q++){
			for(var y = q+1; y < numberOfPlayers; y++){
				if((players[q].position.x == players[y].position.x)){
					if((players[q].position.y == players[y].position.y)){
						if((players[q].position.z == players[y].position.z)){

							switch(q){
								case 0:
								break;
								case 1:
								break;
								case 2:
								break;
								case 3:
								break;


							}

							
												
						}
											
					}

				}
				

			}

		}


	}
	var dotMessageShown = 0;

	var playerLoseTurn = [];
	function checkLostTurns(posx, posy, current){
	

			if(frame[posx][posy].name.includes("dot")){
			
				playerLoseTurn[current] = 1;
			
		}


	}
	var gameover = 0;
	function defaultCamera(){
		camera.position.x = 23;
		camera.position.y = 10;
		camera.position.z = 15;
		camera.rotation.y = 0.7;
		camera.rotation.z = Math.PI/2;
	}
	var showWho = 0;
	function changeCamera()
	{
	
	
		if(Key.isDown(Key.H)){
			
			defaultCamera();
		}
		
		if(Key.isDown(Key.A)){
			
			showWho ^= 1;
		}
		// Press Y to see Game Controls.
		if(Key.isDown(Key.Y)){
			$( "#dialog" ).dialog();
		}
		if(Key.isDown(Key.ENTER)){
			nextPlayer();
			
			
		}
		
		if(Key.isDown(Key.G)){
			// top down view
			camera.position.x = 10;
			camera.position.y = 10;
			camera.position.z = 25;
			camera.rotation.y = 0;
			camera.rotation.z = Math.PI/2;
		}
		
		if(Key.isDown(Key.B)){
			camera.position.z -=0.5;
		}
		if(Key.isDown(Key.V)){
			camera.position.z +=0.5;
		}
	}


	var scoreObject;
	function showCurrentPlayer()
	{
		if( scoreObject != null )
		{
			scene.remove( scoreObject);
		}
		
		var scoreString = "Player " + current + "'s turn!";
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 0.7,
			height: 0.1, 
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0x000000});
		
		scoreObject = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject.position.x = 15;
		scoreObject.position.y = 4.5;
		scoreObject.position.z = 0;
		scoreObject.rotation.x =0;
		scoreObject.rotation.y = 0.8;
		scoreObject.rotation.z = Math.PI/2;
		scene.add( scoreObject );
	}


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
		
		var scoreObjectMaterial2 = new THREE.MeshLambertMaterial({color:0xE67E22});
		
		scoreObject2 = new THREE.Mesh( scoreObjectGeometry2, scoreObjectMaterial2 );
		scoreObject2.position.x = 18;
		scoreObject2.position.y = 0;
		scoreObject2.position.z = 0;
		scoreObject2.rotation.x =0;
		scoreObject2.rotation.y = 0.8;
		scoreObject2.rotation.z = Math.PI/2;
		scene.add( scoreObject2 );
	}

	var camera;
	function setupCamera()
	{
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
		defaultCamera();



		
	}
	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer({alpha: true});
		//renderer = new THREE.WebGLRenderer();
		//renderer.setClearColor( 0x00ffff, 0 );
		
		//renderer.setSize( width,height );
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;

		
		if(numberOfPlayers==0){
			addPlayer();		
		}
	
	}
var addz = 0;
var rotateDown = Math.PI;
var rotateRight = -Math.PI/2;
var rotateUp = 0;	
var rotateLeft = Math.PI/2;
var currentZ = rotateUp;

var addposx = 1.5;

	function addSpotLight()
	{
        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 0, 200 );
        spotLight.shadowCameraNear = 100;
        spotLight.shadowCameraFar = 100;
        spotLight.castShadow = true;
		spotLight.intensity = 1.5;

		scene.add(spotLight);
	
	}
	var projector;

	var x,y,z;
	var prevX;
	var prevY;
	function onDocumentMouseMove( event ) 
	{
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
		
		

		if( selectedobject != null )
		{
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera );
			raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		
			var intersects = raycaster.intersectObject( plane );
			selectedobject.position.copy( intersects[0].point );
		}
		
	}

	var x,y,z;
	var counts = 0;
	function onDocumentMouseDown( event ) 
	{
		event.preventDefault();

			
			
			

		
		// creates a new vector based on mouse position
		var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );

		// resets the projector and directs the camera to mouse pointer location.
		projector.unprojectVector( vector, camera );

		// changes the raycaster position to where ever the camera is.
		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

		// check to see if any objects are intersection with the ray
		var intersects = raycaster.intersectObjects( scene.children, true );
		if ( intersects.length > 0 )
		{
			for( var i=0; i<intersects.length; i++ )
			{
				// get each object out of the intersects array
				var obj = intersects[i].object;

				// get the name
				var name = obj.name;
			
					if( name.includes('horse') )
					{

						selectedobject = obj;
						x = selectedobject.position.x;
						y = selectedobject.position.y;
						z = selectedobject.position.z;
					
						if(showWho == 1){
							
						switch(name){
							case 'horse0':
								alert("You are Player #1, the majestic maroon horse!");
							break;
							case 'horse1':
								alert("You are Player #2, the majestic burly horse!");
							
							break;
							case 'horse2':
								alert("You are Player #3, the majestic golden horse!");
							break;
							case 'horse3':
								alert("You are Player #4, the majestic brown horse!");
							break;

							
						}
						

					}
				}
				selectedobject.position.x-=2;
					counts++;
					return;
				}				
				
		}		

	}

	function onDocumentMouseUp( event ) 
	{
		if(counts%2==0){
			selectedobject.position.x+=2;
			
		}

		event.preventDefault();
		
		if( selectedobject != null )
		{
			selectedobject.position.x = x;
			selectedobject.position.y = y;
			selectedobject.position.z = z;
			selectedobject = null;
		}
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
	