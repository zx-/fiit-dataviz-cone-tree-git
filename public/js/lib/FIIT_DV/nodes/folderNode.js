/**
 * Created by z on 18.4.2016.
 */
function intersection(x0, y0, r0, x1, y1, r1) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy*dy) + (dx*dx));

    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

    /* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a/d);
    y2 = y0 + (dy * a/d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((r0*r0) - (a*a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h/d);
    ry = dx * (h/d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    return [xi, xi_prime, yi, yi_prime];
}

FIIT_DV.FolderNode = class extends THREE.Mesh {

    constructor ( name, data) {

        var geometry = new THREE.TetrahedronGeometry();
        var material = new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534
        } );

        super(geometry,material);
        
        this.myWidth = this.computeWidthFromData(data);

        console.log('computing',name);

        var radius = this.computeRadius( data );
        let keys = Object.getOwnPropertyNames( data ).filter((key) => {
            return !( key === '.' || key === '___childCount' || key === '___files')
        });
        var position = {x: -radius, z:0};

        for( let i = 0; i < keys.length; i++ ) {

            let key = keys[i];

            let keyData = data[key];
            let node = new FIIT_DV.FolderNode( key, keyData );

            this.add(node);
            node.position.set(position.x,-FIIT_DV.LEVEL_MARGIN, position.z);

            //(x0, y0, r0, x1, y1, r1)

            if ( radius != 0 ) {

                if (keys.length > 1) {

                    var childRadius = this.computeWidthFromData(data[keys[i]]) / 2
                            + this.computeWidthFromData(data[keys[(i + 1) % keys.length]]) / 2;

                } else {

                    var childRadius = this.computeWidthFromData(data[keys[i]]) / 2
                        + FIIT_DV.ELEMENT_WIDTH/2
                        + FIIT_DV.ELEMENT_MARGIN;

                }

                let [xi, xi_prime, yi, yi_prime] = intersection(
                    position.x,
                    position.z,
                    childRadius,
                    0,
                    0,
                    radius
                );

                position.x = xi;
                position.z = yi;
            }
        }

        data.___files.forEach( (f) => {

            let file = new FIIT_DV.FileNode(f);

            this.add(file);
            file.position.set(position.x,-FIIT_DV.LEVEL_MARGIN, position.z);

            if ( radius != 0) {

                let [xi, xi_prime, yi, yi_prime] = intersection(
                    position.x,
                    position.z,
                    FIIT_DV.ELEMENT_MARGIN,
                    0,
                    0,
                    radius
                );

                position.x = xi;
                position.z = yi;

            }

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

        var size = ( !data )? 1 : data.___childCount + data.___files.length || 1;

        return size*FIIT_DV.ELEMENT_WIDTH
            + size*FIIT_DV.ELEMENT_MARGIN
            + FIIT_DV.ELEMENT_MARGIN;
    }


    get computedWidth () {
        return this.myWidth;
    }

    computeRadius ( data ) {

        let total = this.myWidth;
        let keys = Object.getOwnPropertyNames( data ).filter((key) => {
            return !( key === '.' || key === '___childCount' || key === '___files')
        });

        let count = data.___childCount + data.___files.length;
        if ( count < 2 ) return 0;



        let size = this.computeWidthFromData(data[keys[0]])/2
            + this.computeWidthFromData(data[keys[1]])/2;

        let angle = size/total * Math.PI *2;

        return (size/2) / Math.sin( angle/2 );

    }

};