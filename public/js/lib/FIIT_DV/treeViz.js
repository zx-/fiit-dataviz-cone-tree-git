/**
 * Created by z on 18.4.2016.
 */

var FIIT_DV = {
    ELEMENT_MARGIN: 2,
    LEVEL_MARGIN: 6,
    ELEMENT_WIDTH: 1,
    LINE_COLOUR: 0x156289,
    LINE_SELECTED_COLOUR: 0xFF0000
};

FIIT_DV.TreeViz = class {

    constructor( data ) {

        console.log(data);
        this.data = data;

        this.timer = new FIIT_DV.Timer();
        this.renderer = new FIIT_DV.Renderer(this.timer);

        this.selector = new FIIT_DV.Selector({
            renderer: this.renderer._renderer,
            scene: this.renderer._scene,
            camera: this.renderer._camera
        });

        this.createTree();

        new FIIT_DV.MouseClickLogger(
            this.renderer._scene,
            this.renderer._camera,
            this.selector
        );


        this.timer.addTickListener(this.selector);

        this.timer.start();

        FIIT_DV.TreeViz.instance = this;
        
    }

    createTree () {

        if ( this.tree ) this.renderer.removeRenderable( this.tree );

        this.tree = new FIIT_DV.Tree( this.data, this.selector );
        this.renderer.addRenderable( this.tree );

    }



};
