/**
 * Created by z on 2.5.2016.
 */

FIIT_DV.Selector = class {

    constructor ( obj ) {
        
        this.elements = {};
        this.htmlObj = obj;

        this.renderer = new THREE.CSS3DRenderer();
        this.scene = new THREE.Scene();
        this.camera = obj.camera;

        var renderer = this.renderer;


        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 0;
        document.body.appendChild( renderer.domElement );

        this._controls = new THREE.OrbitControls( this.camera );//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;
        this._controls.enableZoom = false;


        // var controls = new THREE.TrackballControls( this.camera );
        //
        // controls.rotateSpeed = 1.0;
        // controls.zoomSpeed = 1.2;
        // controls.panSpeed = 0.8;
        //
        // controls.noZoom = false;
        // controls.noPan = false;
        //
        // controls.staticMoving = false;
        // controls.dynamicDampingFactor = 0.3;
        //
        // controls.keys = [ 65, 83, 68 ];

        this.controls = this._controls;

    }

    tick ( delta, now ) {

        this.renderer.render( this.scene, this.camera );
        this.controls.update();


    }

    selectFile ( e ) {

        console.log('click');

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( e.matrixWorld );


            var element = document.createElement( 'iframe' );
            element.src = "file/"+REPOSITORY.id +"/" + encodeURIComponent(e.userData.path).replace(/\./g, '%2F%2F');
            element.style.width = '800px';
            element.style.height = '800px';
            element.style.border = '0px';

            var object = new THREE.CSS3DObject( element );
            object.scale.x = 0.025;
            object.scale.y = 0.025;
        object.position.x = vector.x;
        object.position.y = vector.y - 15;
        object.position.z = vector.z;
        //
        // object.position.y -= 10;

            this.scene.add( object );

        var planeMaterial   = new THREE.MeshBasicMaterial({
            opacity	: 0,
            color	: new THREE.Color('black'),
            blending: THREE.NoBlending,
            side	: THREE.DoubleSide
        });
        var geometry	= new THREE.PlaneGeometry( 800, 800 );
        var object3d	= new THREE.Mesh( geometry, planeMaterial );

        object = object3d;
        object.scale.x = 0.025;
        object.scale.y = 0.025;
        object.position.x = vector.x;
        object.position.y = vector.y - 15;
        object.position.z = vector.z;

        this.htmlObj.scene.add(object3d);


    }

    selectFolder ( element ) {



    }

    addElement ( element ) {

        this.elements[ element.path ] = element;

    }

    deselect ( element ) {



    }

};