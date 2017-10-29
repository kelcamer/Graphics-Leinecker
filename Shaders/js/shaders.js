	/*
	
	3. Add the total score
	
	5. Change Perspective


	*/
	
	var renderer;
	var scene;
	var camera;
	var spotLight;
	

	function init()
	{

		scene = new THREE.Scene();
		
		
		setupCamera();
		setupRenderer();
		addSpotLight();
        
        addSmallSquare(0,0,0,"purple");
        
		
	
		document.body.appendChild( renderer.domElement );
		
		
		render();
	}
	
	function addSmallSquare(xpos,ypos,zpos,name){
        
                var path = "images/" + name + ".jpg";
                 var texture = THREE.ImageUtils.loadTexture(path);
               //  var mat = new THREE.MeshLambertMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .1 );
        
        var mat = THREE.ShaderMaterial(
        {
        
           vertexShader: document.getElementById('vertexShader').textContent,
           vertexFragment: document.getElementById('vertexFragment').textContent
        }
        
        
        );
        
        
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
        
	function render()
	{

		// Request animation frame
		requestAnimationFrame( render );
	
		renderer.render( scene, camera );
	}
	
	
	function setupCamera()
	{
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 10;
		
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
