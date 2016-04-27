/**
 * Created by z on 18.4.2016.
 */

var LangColor = {
    "Ant": 0x320A28,
    "Assembler": 0x008080,
    "ASP": 0x0000ff,
    "Awk": 0x00ffff,
    "BASIC": 0xeeeeee,
    "BETA": 0x40e0d0,
    "C": 0xffd700,
    "C++": 0xff7373,
    "C#": 0xb0e0e6,
    "COBOL": 0xc0c0c0,
    "DOS Batch": 0x003366,
    "Eiffel": 0xffa500,
    "Erlang": 0x00ff00,
    "Flex": 0xf6546a,
    "Fortran": 0x800080,
    "HTML": 0x468499,
    "Java": 0x660066,
    "JavaScript": 0x800000,
    "Lisp": 0x00ced1,
    "Lua": 0xccff00,
    "Make": 0xff6666,
    "MATLAB": 0x66cccc,
    "Objective Cam": 0xdaa520,
    "Pascal": 0x81d8d0,
    "Perl": 0xc39797,
    "PHP": 0xff4040,
    "PL/SQL": 0xffdab9,
    "Python (Pyrex/Cython)": 0x3b5998,
    "REXX": 0x6897bb,
    "Ruby": 0x191970,
    "Scheme": 0xff4444,
    "Shell scripts (Bourne/Korn/Z)": 0xffff66,
    "S-Lang": 0x4169e1,
    "SML (Standard ML)": 0x04040,
    "Tcl": 0,
    "TeX": 0,
    "Vera": 0,
    "Verilog": 0,
    "VHDL": 0,
    "Vim": 0,
    "YACC": 0
};

FIIT_DV.FileNode = class extends THREE.Mesh {

    constructor ( data ) {

        var geometry = new THREE.BoxGeometry( 1, .3, 1 );


        if (data.tags && data.tags[0].language) {

            console.log(data.tags, data.tags[0].language );

            var material = new THREE.MeshPhongMaterial( {
                color: LangColor[data.tags[0].language]
            });

        } else {

            var js = new RegExp('.*\.js','i');
            var rb = new RegExp('.*\.rb','i');
            var html = new RegExp('.*\.html','i');
            var xml = new RegExp('.*\.xml','i');

            var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

            if ( js.test(data.name)){

                material = new THREE.MeshPhongMaterial( {color: 0x800000} );

            }

            if ( rb.test(data.name)){

                material = new THREE.MeshPhongMaterial( {color: 0x191970} );

            }

            if ( html.test(data.name)){

                material = new THREE.MeshPhongMaterial( {color: 0x468499} );

            }

            if ( xml.test(data.name)){

                material = new THREE.MeshPhongMaterial( {color: 0xffff66} );

            }


        }


        super(geometry,material);

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

    get computedWidth () {
        return FIIT_DV.ELEMENT_WIDTH + 2 * FIIT_DV.ELEMENT_MARGIN;
    }

    get computedRadius () {
        return this.computedWidth/2;
    }

};