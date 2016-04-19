/**
 * Created by z on 18.4.2016.
 */

FIIT_DV.FolderNode = class extends THREE.Mesh {

    constructor ( name, data) {

        var geometry = new THREE.TetrahedronGeometry();
        var material = new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534
        } );

        super(geometry,material);
        
        this.myWidth = this.computeWidthFromData(data);
        var startPoint = this.position.x - this.myWidth/2;

        Object.getOwnPropertyNames( data ).forEach( (key) => {

            if ( key === '.' || key === '___childCount' || key === '___files') return;

            console.log(key);

            let keyData = data[key];
            let node = new FIIT_DV.FolderNode( key, keyData );
            let x = startPoint + this.computeWidthFromData( keyData )/2;

            this.add(node);
            startPoint += this.computeWidthFromData( keyData );

            node.position.set(x, -FIIT_DV.LEVEL_MARGIN, 0 );

        });
        
        data.___files.forEach( (f) => {
           
            let file = new FIIT_DV.FileNode(f);

            this.add(file);
            file.position.set(startPoint, -FIIT_DV.LEVEL_MARGIN, 0 );

            startPoint += FIIT_DV.ELEMENT_MARGIN + FIIT_DV.ELEMENT_WIDTH;
            
        });

        this.createText( name );


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

    computeWidthFromData ( data ) {

        var size = data.___childCount + data.___files.length || 1;


        return size*FIIT_DV.ELEMENT_WIDTH
            + size*FIIT_DV.ELEMENT_MARGIN
            + FIIT_DV.ELEMENT_MARGIN;
    }


    get computedWidth () {
        return this.myWidth;
    }

};