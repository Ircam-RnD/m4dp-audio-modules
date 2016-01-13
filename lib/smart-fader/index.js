import AbstractNode from '../core/index.js';


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
        this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        this.input.connect(this._dynamicCompressorNode)
        this._dynamicCompressorNode.connect(this._output)

        this.dB = dB;
    }

    /**
     * Set the dB value
     * @type {number}
     */
    set dB(value){
        this._dB = clampdB( value );
        this._update();
    }

    /**
     * Clips a value within a given range
     * @type {number} value the value to be clipped
     * @type {number} min the lower bound
     * @type {number} max the upper bound
     *
     * @todo move this function into a common file
     */
    static clamp(value, min, max){

        if( max < min ){
            throw new Error("pas bon");
        }


        return Math.max(min, Math.min(value, max));
    }

    /**
     * Clips a value within the proper dB range
     * @type {number} value the value to be clipped
     */
    static clampdB(value){
        const [minValue, maxValue] = dBRange();

        return clamp(value, minValue, maxValue);
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
        return [0, 8];
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
        if(this._dynamicCompressorNode.reduction > 0){
            return true;
        } else {
            return false;
        }
    }

    _update(){

        /// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection;

        /// retrieves the active AudioStreamDescription(s)
        const asd = asdc.actives();

        /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
        const maxTruePeak = asd.maxTruePeak();

        /**
        Le reglage du volume doit se comporter de la facon suivante :
        - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
        - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
        - limiteur/compresseur multicanal au dela du niveau max

        NB : la donnee de loudness integree n'est pas utilisee
        */

        // @todo éclaircir régles d'activation avec Matthieu
        // this._dynamicCompressorNode.threshold
        // this._dynamicCompressorNode.knee
        // this._dynamicCompressorNode.ratio
        // this._dynamicCompressorNode.attack
        // this._dynamicCompressorNode.release
    }
}
