/**
 * Created by z on 18.4.2016.
 */

FIIT_DV.Timer = class {

    constructor () {

        this._lastTime = 0;
        this._tickListeners = [];
        this._isEnabled = false;

    };

    addTickListener ( listener ) {

        this._tickListeners.push( listener );

    };

    start () {

        if ( !this._isEnabled ) {

            this._isEnabled = true;
            this._lastTime = 0;
            this._tick();

        }

    };

    stop () {

        this._isEnabled = false;

    };

    _tick (now) {

        if ( this._isEnabled ) {

            requestAnimationFrame( this._tick.bind( this ) );

        }

        var timeNow = new Date().getTime();
        if ( this._lastTime != 0 ) {

            var elapsed = timeNow - this._lastTime;

            for (var i = 0; i < this._tickListeners.length; i++) {

                this._tickListeners[ i ].tick( elapsed, now );

            }


        }
        this._lastTime = timeNow;

    }
};

