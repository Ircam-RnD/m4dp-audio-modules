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
        this._dB = clampdB( dB );

        // AudioGraph connect
        // @todo: DynamicsCompressorNode accept n channels input
        this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        this.input.connect(this._dynamicCompressorNode)
        this._dynamicCompressorNode.connect(this._output)
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
    	return Math.max(min, Math.min(value, max));
    }

    /**
     * Clips a value within the proper dB range
     * @type {number} value the value to be clipped
     */
	static clampdB(value){
		range 	 = dBRange();
		minValue = range[0];
		maxValue = range[1];
		
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
        // @todo éclaircir régles d'activation avec Matthieu
        // this._dynamicCompressorNode.threshold
        // this._dynamicCompressorNode.knee
        // this._dynamicCompressorNode.ratio
        // this._dynamicCompressorNode.attack
        // this._dynamicCompressorNode.release
    }
}
