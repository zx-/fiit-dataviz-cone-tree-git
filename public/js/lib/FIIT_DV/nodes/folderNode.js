/**
 * Created by z on 18.4.2016.
 */

FIIT_DV.FolderNode = class extends THREE.Mesh {

    constructor ( name, path, data, selector ) {

        var geometry = new THREE.TetrahedronGeometry();
        var material = new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534
        } );

        super(geometry,material);

        this.path = path;
        this.selector = selector;
        this.name = name;


        let keys = Object.getOwnPropertyNames( data ).filter((key) => {
            return !( key === '.' || key === '___childCount' || key === '___files')
        });


        keys.sort();
        this.childNodes = [];
        this.lines = {};

        var matcher = this.selector.filterRegex || new RegExp('.*','i');
        var pathsToIgnore = this.selector.pathsToIgnore || [];

        for( let i = 0; i < keys.length; i++ ) {

            let key = keys[i];
            if( !matcher.test(key) || pathsToIgnore.includes(`${this.path}/${key}`) ) continue;

            let keyData = data[key];
            this.childNodes.push(new FIIT_DV.FolderNode( key, `${this.path}/${key}`, keyData, selector ));

        }

        data.___files.sort((a,b) => a.name > b.name).forEach( (f) => {

            if( !matcher.test(f.name) || pathsToIgnore.includes(`${this.path}/${f.name}`)) return;
            let file = new FIIT_DV.FileNode(this.path, f, selector);
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

                let res = intersection(
                    position.x,
                    position.z,
                    node.computedRadius + nextNode.computedRadius,
                    0,
                    0,
                    this.computedRadius
                );

                if(!res) continue;

                let [xi, xi_prime, yi, yi_prime] = res;

                position.x = xi;
                position.z = yi;

            }

        }

        this.createText( `${name}` );
        this.userData = this;
        selector.addElement(this);
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

        //return Math.ceil(((size/2) / Math.sin( angle/2 )));
        return ((size/2) / Math.sin( angle/2 ));

    }


    createText ( t ) {

        var text = new THREE_Text.SpriteText2D(
            t,
            { align: THREE_Text.textAlign.center,  font: '15px Arial', fillStyle: '#000000' , antialias: true }
        );

        this.add(text);
        text.position.set( 0, FIIT_DV.ELEMENT_MARGIN, 0 );
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

        let line = new THREE.Line( geometry, material );
        this.add( line );

        this.lines[node.path] = line;
    }

    addOrRemoveChildrenFromScene() {
        this.remove(this.text);

        if ( this.childMem ) {
            this.childMem.forEach((c) => this.add(c));
            this.childMem = false;
        } else {
            this.childMem = [];
            for ( let i = this.children.length - 1; i >= 0; i-- ){
                let c = this.children[i];
                this.childMem.push(c);
                this.remove(c);
            }
        }

        this.add(this.text);
    }

    select () {

        this.addOrRemoveChildrenFromScene();
        this.selector.deselect();
        this.selector.selectFolder(this);

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