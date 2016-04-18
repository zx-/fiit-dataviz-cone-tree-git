/**
 * Created by z on 18.4.2016.
 */

FIIT_DV.FileNode = class extends THREE.Mesh {

    constructor ( name, data ) {

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

        super(geometry,material);

    }

};