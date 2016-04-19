/**
 * Created by z on 18.4.2016.
 */

FIIT_DV.FileNode = class extends THREE.Mesh {

    constructor ( data ) {

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

        super(geometry,material);

        this.createText( data.name );

    }

    createText ( t ) {

        var text = new THREE_Text.Text2D(
            t,
            { align: THREE_Text.textAlign.center,  font: '15px Arial', fillStyle: '#000000' , antialias: true }
        );

        this.add(text);
        text.position.set( 0 , -0.5, 0 );
        text.scale.set( 0.05, 0.05, 0.05 );

        this.text = text;

    }

};