/**
 * Created by z on 18.4.2016.
 */


FIIT_DV.FileNode = class extends THREE.Mesh {

    constructor ( data ) {

        var geometry = new THREE.BoxGeometry( 1, .3, 1 );


        if (data.tags && data.tags[0].language) {

            var material = new THREE.MeshPhongMaterial( {
                color: LangColor[data.tags[0].language]
            });

        } else {

            var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

            FIIT_DV.FileNode.FILE_TEST.forEach((test) => {
                if( test.regex.test(data.name) )
                    material = new THREE.MeshPhongMaterial( {color:test.color} );
            });

        }


        super(geometry,material);

        this.userData = this;
        this.createText( data.name );

    }


    createText ( t ) {

        var text = new THREE_Text.SpriteText2D(
      //  var text = new THREE_Text.Text2D(
            t,
            { align: THREE_Text.textAlign.center,  font: '15px Arial', fillStyle: '#000000' , antialias: true }
        );

        this.add(text);
        text.position.set( 0 , -FIIT_DV.ELEMENT_MARGIN/2, 0 );
        text.scale.set( 0.05, 0.05, 0.05 );
        //text.rotation.z -= Math.PI/2;

        this.text = text;

    }

    select () {
        console.log('selected',this);
    }

    get computedWidth () {
        return FIIT_DV.ELEMENT_WIDTH + 2 * FIIT_DV.ELEMENT_MARGIN;
    }

    get computedRadius () {
        return this.computedWidth/2;
    }


};

FIIT_DV.FileNode.FILE_TEST = [
    { regex: new RegExp('.*\.js','i'),      color: 0x800000 },
    { regex: new RegExp('.*\.rb','i'),      color: 0x191970 },
    { regex: new RegExp('.*\.html','i'),    color: 0x468499 },
    { regex: new RegExp('.*\.xml','i'),     color: 0xffff66 }
];