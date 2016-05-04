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

        // this._controls = new THREE.OrbitControls( this.camera );//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        // this._controls.enableDamping = true;
        // this._controls.dampingFactor = 0.25;
        // this._controls.enableZoom = false;

        this.createControls();
        this.createFilterEvents();

    }

    tick ( delta, now ) {

        this.renderer.render( this.scene, this.camera, document.getElementById( "web-gl-canvas" ) );
        this.controls.update();

    }

    createFilterEvents() {
        var selector = this;

        $('#name-filter').on('blur', function () {
            selector.filterByName( $(this).val() );
        });
        $('#redraw-button').on('click',(event)=>{
            event.preventDefault();
            event.stopPropagation();
            selector.filterRegex = new RegExp($('#name-filter').val(), "i");
            FIIT_DV.TreeViz.instance.createTree();
        });
    }


    filterByName( name ) {

        this.deselect();

        var nameRegex = new RegExp(name, "i");
        var elemPaths = Object.getOwnPropertyNames(this.elements);

        elemPaths.forEach(( path )=>{
            let elemHash = this.elements[path];
            let elem = elemHash.element;

            if( nameRegex.test( elem.name ) ){

                elemHash.selected = true;
              //  console.log('matched', elem.name);
                this.colorLines(elem.parent,elem.path);
                //e.material.color.setHex(FIIT_DV.LINE_SELECTED_COLOUR);


            }
        });


    }

    createControls () {
        var controls = new THREE.TrackballControls( this.camera );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [ 65, 83, 68 ];
        //controls.enabled = false;


        this.controls = controls;
    }

    selectFile ( e ) {

        var fileElemHash = this.elements[ e.userData.path ];
        if ( fileElemHash.selected ) return;

        fileElemHash.selected = true;
        fileElemHash.detail = {};

        var ePositionVec = new THREE.Vector3();
        ePositionVec.setFromMatrixPosition( e.matrixWorld );

        if ( !fileElemHash.detail.iframeDetail &&  !fileElemHash.detail.plane) {

            fileElemHash.detail.iframeDetail = this.createCss3IframeElement(
                ePositionVec,
                e.userData.path
            );

            fileElemHash.detail.plane = this.createSceneIframeElement(
                ePositionVec
            );

        }
        this.scene.add( fileElemHash.detail.iframeDetail ); // add to css3scene
        this.htmlObj.scene.add(fileElemHash.detail.plane); //add to normal scene

        this.colorLines( fileElemHash.element.parent, fileElemHash.element.path );


    //    this.lookAtRec( fileElemHash.element.parent );

        var lookAtvec = new THREE.Vector3(this.camera.x,0,this.camera.z);
        var axis = new THREE.Vector3(0,1,0);
        var rad = Math.PI/2;

        // fileElemHash.detail.iframeDetail.lookAt(lookAtvec);
        // fileElemHash.detail.plane.lookAt(lookAtvec);

        fileElemHash.detail.iframeDetail.rotateOnAxis(axis,rad);
        fileElemHash.detail.plane.rotateOnAxis(axis,rad);

    }

    lookAtRec ( f ) {

        if(!f.lines ) return; // check if it is folder or sumathing

        this.lookAtRec( f.parent );

        f.lookAt(new THREE.Vector3(this.camera.x, 0, this.camera.y));

    };

    colorLines ( e, path, color = FIIT_DV.LINE_SELECTED_COLOUR ) {
        if(!e.lines || !e.lines[path] ) return;

        e.lines[path].material.color.setHex(color);
        e.material.color.setHex(color);
        this.colorLines( e.parent, e.path, color );
    }

    selectFolder ( element ) {



    }

    addElement ( element ) {

        this.elements[ element.path ] = {element: element, detail: null, selected: false};

    }

    createCss3IframeElement( position, path ) {
        var element = document.createElement( 'iframe' );
        element.src = "file/"+REPOSITORY.id +"/" + encodeURIComponent(path).replace(/\./g, '%2F%2F');
        element.style.width = '800px';
        element.style.height = '800px';
        element.style.border = '0px';

        var object = new THREE.CSS3DObject( element );
        object.scale.x = 0.025;
        object.scale.y = 0.025;
        object.position.x = position.x + 0.7 ;
        object.position.y = position.y - 15;
        object.position.z = position.z + 0.7;
        //
        // object.position.y -= 10;

        return object;
    }

    createSceneIframeElement( position ) {

        var planeMaterial   = new THREE.MeshBasicMaterial({
            opacity	: 0,
            color	: new THREE.Color('black'),
            blending: THREE.NoBlending,
            side	: THREE.DoubleSide
        });
        var geometry	= new THREE.PlaneGeometry( 800, 800 );
        var object	= new THREE.Mesh( geometry, planeMaterial );

        object.scale.x = 0.025;
        object.scale.y = 0.025;
        object.position.x = position.x + 0.7 ;
        object.position.y = position.y - 15;
        object.position.z = position.z + 0.7;

        return object;
    }

    deselect () {

        var elemPaths = Object.getOwnPropertyNames(this.elements);

        elemPaths.forEach((path) => {
            let elemHash = this.elements[path];
            if( elemHash.selected ) {

                this.colorLines(
                    elemHash.element.parent,
                    path,
                    FIIT_DV.LINE_COLOUR
                );

                if ( elemHash.detail ) {
                    this.scene.remove(elemHash.detail.iframeDetail);
                    this.htmlObj.scene.remove(elemHash.detail.plane);
                }
                elemHash.selected = false;

            }
        })

    }

};