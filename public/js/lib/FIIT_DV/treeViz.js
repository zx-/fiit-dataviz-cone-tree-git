/**
 * Created by z on 18.4.2016.
 */

var FIIT_DV = {
    ELEMENT_MARGIN: 1,
    LEVEL_MARGIN: 3,
    ELEMENT_WIDTH: 1
};

FIIT_DV.TreeViz = class {

    constructor( data ) {

        console.log(data);

        this.timer = new FIIT_DV.Timer();
        this.renderer = new FIIT_DV.Renderer(this.timer);

        this.tree = new FIIT_DV.Tree( data );
        console.log(this.tree);

        this.renderer.addRenderable( this.tree );


        this.timer.start();
        
    }

};
