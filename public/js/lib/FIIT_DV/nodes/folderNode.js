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


        let keys = Object.getOwnPropertyNames( data ).filter((key) => {
            return !( key === '.' || key === '___childCount' || key === '___files')
        });


        keys.sort();
        this.childNodes = [];
        for( let i = 0; i < keys.length; i++ ) {

            let key = keys[i];
            let keyData = data[key];
            this.childNodes.push(new FIIT_DV.FolderNode( key, keyData ));

        }

        data.___files.sort((a,b) => a.name > b.name).forEach( (f) => {

            let file = new FIIT_DV.FileNode(f);
            this.childNodes.push(file);

        });

        var circumference = this.childNodes.reduce((val, node) => {
            return val + node.computedWidth; // there will be one more marging than should // who cares
        }, 0);


        this.radius = this.computeRadius(circumference, this.childNodes);

        if ( this.childNodes.length < 2) {

            this.childNodes.forEach((node) => {
                node.position.set(0, -FIIT_DV.LEVEL_MARGIN, 0) ;
                this.add(node);
                this.addLineToNode(node);
            });

        } else {

            var position = {x: -this.computedRadius, z: 0};
            for ( let [ node, nextNode ] of this.makeChildDupletIterator()) {

                this.add(node);
                node.position.set(position.x, -FIIT_DV.LEVEL_MARGIN, position.z);
                this.addLineToNode(node);

                let [xi, xi_prime, yi, yi_prime] = intersection(
                    position.x,
                    position.z,
                    node.computedRadius + nextNode.computedRadius,
                    0,
                    0,
                    this.computedRadius
                );

                position.x = xi;
                position.z = yi;

            }

        }

        this.createText( `${name} w:${this.computedWidth} ch:${data.___childCount}` );
        this.userData = this;
    }

    * makeChildDupletIterator () { // Return duplets of nodes
        var nextIndex = 0;
        var array = this.childNodes;
        while ( nextIndex != array.length )
            yield [array[nextIndex++ % array.length],array[nextIndex % array.length]]

    }

    computeRadius ( circumference, childNodes ) {
        
        // If folder has none or one child treat him as file
        if( childNodes.length < 2 ) 
            return FIIT_DV.ELEMENT_WIDTH + 2 * FIIT_DV.ELEMENT_MARGIN;        

        let size = childNodes[0].computedWidth/2 + childNodes[1].computedWidth/2;

        let angle = size/circumference * Math.PI *2;

        return Math.ceil(((size/2) / Math.sin( angle/2 )));

    }


    createText ( t ) {

        var text = new THREE_Text.SpriteText2D(
            t,
            { align: THREE_Text.textAlign.center,  font: '15px Arial', fillStyle: '#000000' , antialias: true }
        );

        this.add(text);
        text.position.set( 0, FIIT_DV.ELEMENT_MARGIN/2, 0 );
        text.scale.set( 0.05, 0.05, 0.05 );

        this.text = text;

    }

    computeWidthFromData ( data ) {

        var size = ( !data )? 1 : data.___childCount + data.___files.length || 1;

        return (size*FIIT_DV.ELEMENT_WIDTH + size*FIIT_DV.ELEMENT_MARGIN)/ Math.PI;
    }
    
    addLineToNode ( node ) {
        var material = new THREE.LineBasicMaterial({
            color: FIIT_DV.LINE_COLOUR
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( 0, 0, 0 ),
            node.position
        );

        this.line = new THREE.Line( geometry, material );
        this.add( this.line );
    }

    select () {
        console.log('selected',this);
    }

    get computedRadius () {
        return this.radius;
    }

    get computedDiameter () {
        return this.radius*2;
    }

    get computedWidth () {
        return this.computedDiameter;
    }

};