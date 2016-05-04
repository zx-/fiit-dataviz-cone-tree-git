/**
 * Created by z on 30.4.2016.
 */

FIIT_DV.MouseClickLogger = class {

    constructor ( scene, camera, selector ) {

        this.scene = scene;
        this.camera = camera;
        this.selector = selector;

        this.mouseVec2 = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        $('div').on( 'mousedown', this.mouseDown.bind(this));
        $('div').on( 'mouseup', this.mouseUp.bind(this));

        this.ignoredTypes = [ "Line", "Sprite" ];

        this.lastClick = 0;

    }

    static get CLICK_MAX_DELAY () {
        return 100;
    }

    mouseDown ( event ) {
        this.lastClick = Date.now();
    }

    mouseUp ( event ) {
        if ( Date.now() - this.lastClick < FIIT_DV.MouseClickLogger.CLICK_MAX_DELAY )
            this.mouseClick( event );
    }


    mouseClick ( event ) {

        this.mouseVec2.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouseVec2.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera( this.mouseVec2, this.camera );
        var intersects = this.raycaster.intersectObjects( this.scene.children, true );

        var clickedObject = null;

        for( clickedObject of intersects ) {
            if ( !this.ignoredTypes.includes( clickedObject.object.type )) break;
        }

        if ( clickedObject != null
            && typeof clickedObject.object.userData.select == 'function' ) {

            clickedObject.object.userData.select();

        } else {
            this.selector.deselect();
        }

    }

};