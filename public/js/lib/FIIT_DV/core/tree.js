/**
 * Created by z on 18.4.2016.
 */

FIIT_DV.Tree = class extends THREE.Object3D {

    constructor ( data, selector ) {

        super();
        this.add( new FIIT_DV.FolderNode( 'root', '', data, selector ));

    }

};
