	/*
	
	3. Add the total score
	
	5. Change Perspective


	*/
	
	var renderer;
	var scene;
	var camera;
	var spotLight;
	var smsh;
	
	//<!-- add objects in the scope so all methods can access -->
	var groundPlane;
	var ball;
	var maxloop = 30;
	
	//<!-- 3. Add the following two lines. -->
	Physijs.scripts.worker = 'libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
	
	function init()
	{
		
		loadSounds();
		
		//<!-- 4. Edit the scene creation -->
		scene = new Physijs.Scene();
		
		// sets the z value of gravity.
		scene.setGravity(new THREE.Vector3( 0, 0, -25 ));
		
		setupCamera();
		setupRenderer();
		addSpotLight();
		showWord();
		//<!-- 5. Ground plane -->
		createGroundPlane();
		
		//<!-- 7. Create and add cannon -->
		createCannon();
		
		//<!-- 11. Create ball -->
		createBall();
		
		//<!-- 14. Create target -->
		createTarget();
	
        createLeftSide();
		createRightSide();
		updateScore();
		//createBackPanel();
		// Output to the stream
		document.body.appendChild( renderer.domElement );
		
		// Call render
		render();
	}
	
	function createBackPanel(){

		var texture = THREE.ImageUtils.loadTexture('images/purple.jpg');
		var planeMaterial = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .8 );
		
		var planeGeometry2 = new THREE.PlaneGeometry( 50, 20, 20 );
		boundary2 = new Physijs.BoxMesh(planeGeometry2, planeMaterial, 0)

		boundary2.position.z = 100;
		boundary2.rotation.z = 0;
		boundary2.name = "back";
	
		scene.add(boundary2);
		
		
	}

    var left;
var xdist = 100;
var ydist = 100;
var zdist = 0;  // do not change this
var rot = 0.3;
    function createLeftSide(){
    
    var texture = THREE.ImageUtils.loadTexture('images/woodenbackground.jpg');
    var mat = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .8 );
    
    var geo = new THREE.PlaneGeometry( 10, 500, 1000 );
    left = new Physijs.BoxMesh(geo, mat, 0)
    
    left.position.z = zdist;
    left.position.x = -1*xdist;
    left.position.y = ydist;
        left.rotation.z = -1*rot;
    left.name = "left";
    
    scene.add(left);
    
    
    }
    var right;
    function createRightSide(){
    
    var texture = THREE.ImageUtils.loadTexture('images/woodenbackground.jpg');
    var mat1 = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .8 );
    
    
        
    var geo1 = new THREE.PlaneGeometry( 10, 500, 1000 );
    right = new Physijs.BoxMesh(geo1, mat1, 0)
    
    right.position.z = zdist;
    right.position.x = xdist;
    right.position.y = ydist;

    right.rotation.z = rot;
    right.name = "right";
    
    scene.add(right);
    
    
    }
	function render()
	{
		//<!-- 6. Physics simulation -->
		scene.simulate();
		
		//<!-- 9. Maintain cannon elevation controls -->
		maintainCannonElevationControls();
		
		//<!-- 10. Maintain cannon right/left -->
		maintainCannonRightLeft();

		//<!-- 12. Look for ball keypresses -->
		maintainBallKeypresses();
		
		//<!-- 15. Check for ball off the plane -->
		checkBallPosition();
		checkScore();
		// Request animation frame
		requestAnimationFrame( render );
		
		// Call render()
		renderer.render( scene, camera );
	}
	function checkScore(){

		if(playerScore == 30){

			if(rounds < 3){
				alert("Congratulations! You've won the game! You must be a pro at this game! You've officially beaten the developer's record with " + rounds + " rounds!");
				
			}
			else if(rounds < 7){
				alert("Congratulations! You've won the game! You did pretty well!");
			}
			else if(rounds < 10){
				alert("Congratulations! You've won the game! Seems like you're an average Joe. It took you " + rounds + " rounds, which is kind of a lot.");
				
			}
			else{
				alert("Congratulations! You've won the game, but you took forever.... It's been " + rounds + " rounds!");
			}

			playerScore = 0;
			updateScore();
		}

	}
	//<!-- 5. Ground plane -->
	function createGroundPlane()
	{
        var texture = THREE.ImageUtils.loadTexture('images/woodenbackground.jpg');
        var mat3 = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .8 );
        
        
        
        var geo3 = new THREE.PlaneGeometry( 400, 500, 100 );
        ground = new Physijs.BoxMesh(geo3, mat3, 0)
        
        ground.position.z = -5;
        ground.position.x = 0;
        ground.position.y = ydist;
        
        ground.name = "ground";
        
        scene.add(ground);
	}
	var backgroundMusic;
	var ballhit;
	function loadSounds(){
		backgroundMusic = new Audio("music/lightning.mp3");
		backgroundMusic.play();
	ballhit = new Audio('music/test.wav');
	
	}
	//<!-- 7. Create cannon -->
	// y = -80 is center of alleyway
	function createCannon()
	{
		var cylinderGeometry = new THREE.CylinderGeometry( 10, 10, 30 );
		var cylinderMaterial = new THREE.MeshLambertMaterial({color:'green'});
		var can = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
		can.position.y = 100;
		can.position.z = 10;
		can.position.x = 0;
    
		//<!-- 8. Create Object3D wrapper that will allow use to correctly rotate -->
		cannon = new THREE.Object3D();
		cannon.add( can );
		
		// tilts cannon
		cannon.rotation.z = Math.PI;
        cannon.rotation.y = 0;
        cannon.rotation.x = 0;
        
		cannon.name = "CannonBall";
		scene.add( cannon );
	}
	//<!-- 9. Maintain cannon elevation controls -->
	function maintainCannonElevationControls()
	{
		if(cannon.position.x > 60 || cannon.position.x < -60){
			cannon.rotation.z = Math.PI;
		}
		if( Key.isDown(Key.N) &&  cannon.rotation.z > (Math.PI/1.25) && cannon.position.x < 60 && cannon.position.x > -60)
		{
		
			cannon.rotation.z -= 0.05;
			
		}
		if( Key.isDown(Key.M) && cannon.rotation.z < (1.25*Math.PI) && cannon.position.x < 60 && cannon.position.x > -60)
		{
			cannon.rotation.z += 0.05;
			
		}

		if(Key.isDown(Key.RIGHTARROW) && cannon.position.x < 120){
			cannon.position.x += 1;
		}
		if(Key.isDown(Key.LEFTARROW) && cannon.position.x > -120){
			cannon.position.x -= 1;
		}


		if(Key.isDown(Key.C)){
			
				camera.position.x = 0;
				camera.position.y = 200;
				camera.position.z = 200;
				camera.rotation.x = -0.7;
				camera.rotation.z = Math.PI;
				
		}
		if(Key.isDown(Key.V)){
			
				camera.position.x = 0;
				camera.position.y = -200;
				camera.position.z = 300;
				camera.rotation.x = 0;
				camera.lookAt(scene.position);
		}
		if(Key.isDown(Key.G)){
			camera.rotation.z +=0.1;
		}
		if(Key.isDown(Key.H)){
			camera.rotation.z -=0.1;
		}
		if(Key.isDown(Key.Y)){
			camera.position.z +=0.5;
		}
		if(Key.isDown(Key.T)){
			camera.position.z -=0.5;
		}
		if(Key.isDown(Key.U)){
			camera.position.z -=0.5;
		}
		if(Key.isDown(Key.S)){
			shape = 1;
		}
		if(Key.isDown(Key.P)){
			shape = 0;
		}
		if(Key.isDown(Key.R)){
			shape = 2;
		}
	}

	//<!-- 10. Maintain cannon right/left -->
	function maintainCannonRightLeft()
	{
		if( Key.isDown(Key.A) && cannon.position.z < 0.8)
		{
			cannon.position.z += 0.1;
		}
		if( Key.isDown(Key.D) && cannon.position.z > -4.5)
		{
			cannon.position.z -= 0.1;
		}
	}
	
	//<!-- 12. Look for ball keypresses -->
	var ballLaunched = false;
	var curveRate = 200000;
	var speed = 200000;
	var rounds = -1;
	function maintainBallKeypresses()
	{
		if( !ballLaunched && Key.isDown(Key.UPARROW) )
		{
			
			
			createBall();
			ballLaunched = true;
			state = 0;
			scene.add( ball );
			// 8000, -( Math.PI / 2 - cannon.rotation.z ) * 4000, -cannon.rotation.y * 10000
           // ball.applyCentralImpulse( new THREE.Vector3(0,200000,0) );
            ball.applyCentralImpulse(new THREE.Vector3(Math.cos(Math.PI/2 - cannon.rotation.z)*curveRate, speed, -cannon.rotation.y * 10000));
			
			if(ball.position.y > 100){
				ball.applyCentralImpulse(new THREE.Vector3(0,10000000,0));
			}
			//ball.applyCentralImpulse( new THREE.Vector3(Math.sin(cannon.rotation.x),6000,0) );
		}
		

		
	}
	
	//<!-- 11. Create ball -->
	var shape = 0;
	function createBall()
	{
		rounds++;
		var ballGeometry;
		if(shape == 0){
		 ballGeometry = new THREE.SphereGeometry( 7 );
		}
		else if(shape == 1){
			ballGeometry = new THREE.BoxGeometry(7,7,7);
		}
		else if(shape == 2){
			ballGeometry = new THREE.SphereGeometry(Math.random()*10);
			
		}
		var ballMaterial = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'#FF00FF'}), 6, 0.1 );
		ball = new Physijs.SphereMesh( ballGeometry, ballMaterial );
        ball.position.x = cannon.position.x - Math.cos((Math.PI/2)-cannon.rotation.z) * 110;
        ball.position.y = -100;
        ball.position.z = cannon.position.z;
	//	ball.position.x = cannon.position.x - Math.cos((Math.PI/2)-cannon.rotation.z) * 10;
//		ball.position.y = cannon.position.y -Math.cos(cannon.rotation.z) * 10;
//		ball.position.z = cannon.position.z - Math.sin(cannon.rotation.y) * 10;
		
		ball.name = 'CannonBall';
		
		ball.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity )
		{
			if( other_object.name != "ground" && other_object.name == "pin" )
			{
				ballhit.play();

			}
		});
	}

	//<!-- 14. Create target -->
	var targetlist;
    var center;
	var interval;
	var msh;
	function createTarget()
	{
        
        center = 0;
        interval = 10;
		targetlist = [];
		
		for( var i=0; i<maxloop; i++ )
		{
			var geo = new THREE.BoxGeometry( 4, 4, 12 );

			// friction restitution
			var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'white'}), 0.8, .95 );
			 msh = new Physijs.BoxMesh( geo, mat );
			msh.name="pin";
			// ten blocks positions
			switch(i)
			{
				// back row
				case 0: msh.position.x = (center - interval/2 - interval);
						msh.position.y = 130;
						
						break;
				case 1: msh.position.x = center-interval/2;
						msh.position.y = 130;
						break;
				
						
				case 3: msh.position.x = -1*(center-interval/2);
						msh.position.y = 130;
						break;
                case 4: msh.position.x = -1*(center - interval/2 - interval);
                        msh.position.y = 130;
                    
                        break;
					
				// middle row
                case 5: msh.position.x = -interval;
                    msh.position.y = 110;

                    break;
                case 6: msh.position.x = center;
                    msh.position.y = 110;

                    break;
                case 7: msh.position.x = interval;
                    msh.position.y = 110;

					break;
				// front row
                case 8: msh.position.x = interval/2;
                    msh.position.y = 90;

                    break;
                case 9: msh.position.x = -1*(interval/2);
                    msh.position.y = 90;

					break;
				// first pin
				case 2: msh.position.x = center;
				msh.position.y = 70;

					break;
				
				// back row
				case 10: msh.position.x = (center - interval/2 - interval)-50;
				msh.position.y = 130;
				
				break;
		case 11: msh.position.x = center-interval/2-50;
				msh.position.y = 130;
				break;
		
				
		case 13: msh.position.x = -1*(center-interval/2)-50;
				msh.position.y = 130;
				break;
		case 14: msh.position.x = -1*(center - interval/2 - interval)-50;
				msh.position.y = 130;
			
				break;
			
		// middle row
		case 15: msh.position.x = -interval-50;
			msh.position.y = 110;

			break;
		case 16: msh.position.x = center-50;
			msh.position.y = 110;

			break;
		case 17: msh.position.x = interval-50;
			msh.position.y = 110;

			break;
		// front row
		case 18: msh.position.x = interval/2 -50;
			msh.position.y = 90;

			break;
		case 19: msh.position.x = -1*(interval/2)-50;
			msh.position.y = 90;

			break;
		// first pin
		case 12: msh.position.x = center-50;
		msh.position.y = 70;

			break;


			// back row
			case 20: msh.position.x = (center - interval/2 - interval)+50;
			msh.position.y = 130;
			
			break;
	case 21: msh.position.x = center-interval/2+50;
			msh.position.y = 130;
			break;
	
			
	case 23: msh.position.x = -1*(center-interval/2)+50;
			msh.position.y = 130;
			break;
	case 24: msh.position.x = -1*(center - interval/2 - interval)+50;
			msh.position.y = 130;
		
			break;
		
	// middle row
	case 25: msh.position.x = -interval+50;
		msh.position.y = 110;

		break;
	case 26: msh.position.x = center+50;
		msh.position.y = 110;

		break;
	case 27: msh.position.x = interval+50;
		msh.position.y = 110;

		break;
	// front row
	case 28: msh.position.x = interval/2 +50;
		msh.position.y = 90;

		break;
	case 29: msh.position.x = -1*(interval/2)+50;
		msh.position.y = 90;

		break;
	// first pin
	case 22: msh.position.x = center+50;
	msh.position.y = 70;

		break;
			}
			
			msh.position.z = 1;
			targetlist.push( msh );
			scene.add( msh );

			
		}
		
		
	}
	var thisround = -1;
	function checkFallenTargets(){
		
		thisround = 0;
		var removal = 0;
		if(thisround != maxloop){
		var x = 0;
		for(x = 0; x < maxloop; x++){
			if(Math.abs(targetlist[x].position.z - 1) > 0.001){
				thisround++;
				scene.remove(targetlist[x]);
				removal++;
			}
		}
			playerScore = thisround;
		}

	
		if(removal == maxloop){
			var y;
			createTarget();
			
			
			removal = 0;
		}

		

	}
//	<!-- 15. Check for ball off the plane -->
var state = 0;
	function checkBallPosition()
	{
		if( ball.position.y > 400 && state == 0 )
		{
			ballLaunched = false;
			checkFallenTargets();
			
			scene.remove(ball);
			state = 1;
			
			updateScore();
		}
	}
	
	function setupCamera()
	{
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.x = 0;
		camera.position.y = -200;
		camera.position.z = 300;
		

        
        
        //new view
        /*
             camera.position.x = -200;
        camera.position.y = 0;
        camera.position.z = 50;
       */
		camera.lookAt( scene.position );
	}
	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer();
		//						color     alpha
		renderer.setClearColor( 0x000000, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
	}
	var scoreObject;
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
			size: 6,
			height: 0.4, 
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial2 = new THREE.MeshLambertMaterial({color:0xFFFFFF});
		
		scoreObject2 = new THREE.Mesh( scoreObjectGeometry2, scoreObjectMaterial2 );
		scoreObject2.position.x = 30;
		scoreObject2.position.y = -129;
		scoreObject2.position.z = 20;
		scoreObject2.rotation.x =0;
		scoreObject2.rotation.z = 0;
		scene.add( scoreObject2 );
	}

	function updateScore()
	{
		if( scoreObject != null )
		{
			scene.remove( scoreObject );
		}
		
		var scoreString = "Total Score: " + playerScore;
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 10,
			height: 0.4,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0xFFFFFF});
		
		scoreObject = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject.position.x = -120;
		scoreObject.position.y = -130;
		scoreObject.position.z = 20;
		scoreObject.rotation.x =0;
		scene.add( scoreObject );
	}
	function addSpotLight()
	{
        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 200, 200 );
        spotLight.shadowCameraNear = 10;
        spotLight.shadowCameraFar = 100;
        spotLight.castShadow = true;
		spotLight.intensity = 3;

		spotLight2 = new THREE.SpotLight( 0xffffff );
        spotLight2.position.set( 0, 0, 0 );
        spotLight2.shadowCameraNear = 10;
        spotLight2.shadowCameraFar = 100;
        spotLight2.castShadow = true;
		spotLight2.intensity = 10;
		scene.add(spotLight);
		scene.add(spotLight2);
	}
	
	window.onload = init;
