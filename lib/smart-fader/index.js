import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

export default class SmartFader extends AbstractNode {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     * @param {number} dB - dB value for the SmartFader.
     * @todo give range of accepted values
     */
    constructor(audioContext, audioStreamDescriptionCollection = undefined, dB = undefined){
        super(audioContext, audioStreamDescriptionCollection);
        this._dB = undefined;

        // AudioGraph connect
        // @todo: DynamicsCompressorNode accept n channels input
        this._gainNode = audioContext.createGain();
        this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        
        this.input.connect( this._gainNode );
        this._gainNode.connect( this._dynamicCompressorNode );
        this._dynamicCompressorNode.connect( this._output );

        this.dB = dB;

        this._updateCompressorSettings();
    }

    /**
     * Set the dB value
     * @type {number}
     */
    set dB(value){
        this._dB = SmartFader.clampdB( value );
        this._update();
    }



    /**
     * Clips a value within the proper dB range
     * @type {number} value the value to be clipped
     */
    static clampdB(value){
        const [minValue, maxValue] = SmartFader.dBRange;

        return utilities.clamp(value, minValue, maxValue);
    }

    /**
     * Get the dB value
     * @type {number}
     */
    get dB(){
        return this._dB;
    }

    /**
     * Get the dB range
     * @type {array}
     * @details +8 dB suffisent, pour passer du -23 au -15 LUFS (iTunes), c'est l'idée.
     */
    static get dBRange(){
        return [-60, 8];
    }

    /**
     * Returns the default value (in dB)
     * @type {number}
     */
    static get dBDefault(){
        return 0;
    }

    /**
     * Returns the dynamic compression state
     * @type {boolean}
     */
    get dynamicCompressionState(){

        /// representing the amount of gain reduction currently applied by the compressor to the signal.

        /**
        Intended for metering purposes, it returns a value in dB, or 0 (no gain reduction) if no signal is fed
        into the DynamicsCompressorNode. The range of this value is between -20 and 0 (in dB).
        */

        const reduction = this._dynamicCompressorNode.reduction.value;

        const state = ( reduction < -0.5 ? true : false );

        return state;        
    }

    /**
     * Notification when the active stream(s) changes
     */
    activeStreamsChanged(){
        this._updateCompressorSettings();
    }

    _updateCompressorSettings(){

        /// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection;
        
        if( asdc.hasActiveStream === false ){
            //console.log( "no active streams !!");
            return;
        }
        
        ///@todo : que faire si plusieurs streams sont actifs ??

        /// retrieves the active AudioStreamDescription(s)
        const asd = asdc.actives;

        /// sanity check
        if( asd.length <= 0 ){
            throw new Error("Y'a un bug qq part...");
        }
        
        /// use the first active stream (???)
        const activeStream = asd[0];

        /**
        Le reglage du volume doit se comporter de la facon suivante :
        - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
        - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
        - limiteur/compresseur multicanal au dela du niveau max
        */

        /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
        /// (expressed in dBTP)
        const maxTruePeak = activeStream.maxTruePeak;

        /// integrated loudness (in LUFS)
        const nominal = activeStream.loudness;

        /// sanity check
        if( nominal >= 0.0 ){
            throw new Error("Ca parait pas bon...");
        }

        const threshold = nominal + Math.abs( maxTruePeak );

        /// representing the decibel value above which the compression will start taking effect
        this._dynamicCompressorNode.threshold.value = threshold;

        /// representing the amount of change, in dB, needed in the input for a 1 dB change in the output
        this._dynamicCompressorNode.ratio.value = 3;  

        /// representing the amount of time, in seconds, required to reduce the gain by 10 dB
        this._dynamicCompressorNode.attack.value = 0.1;  

        /// representing the amount of time, in seconds, required to increase the gain by 10 dB
        this._dynamicCompressorNode.release.value = 0.25;
    }

    _update(){

        //console.log( "_update" );

        /// the current fader value, in dB
        const fader = this._dB;

        if( typeof fader === "undefined" || isNaN( fader ) === true ) {
            /// this can happen during the construction...
            return;
        }

        const lin = utilities.dB2lin( fader );

        this._gainNode.gain.value = lin;
    }
}
