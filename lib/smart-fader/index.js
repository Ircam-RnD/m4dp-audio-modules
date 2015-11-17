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
        this._dB = dB;

        // AudioGraph connect
        // @todo: DynamicsCompressorNode accept n channels input
        this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        this.input.connect(this._dynamicCompressorNode)
        this._dynamicCompressorNode.connect(this._output)
    }
    /**
     * Set the dB value
     * @todo give range of accepted values
     * @type {number}
     */
    set dB(value){
        // @todo clip value
        this._dB = value;
        this._update();
    }
    /**
     * Get the dB value
     * @type {number}
     */
    get dB(){
        return this._dB;
    }
    // @todo Mathieu -80dB => +20dB
    /**
     * Get the dB range
     * @type {array}
     */
    static get dBRange(){
        return [-80, 20]
    }
    static get dBDefault(){
        return 0
    }
    /**
     * Get the dynamic compression state
     * @type {boolean}
     */
    get dynamicCompressionState(){
        if(this._dynamicCompressorNode.reduction > 0){
            return true
        } else {
            return false
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
