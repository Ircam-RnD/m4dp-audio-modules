import AbstractNode from '../core/index.js';


export default class SmartFader extends AbstractNode {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {number} db - db value for the SmartFader.
     * @param {number} loudness - loudness value.
     * @param {number} maxTruePeak - maxTruePeak value.
     * @todo give range of accepted values
     */
    constructor(audioContext, db = undefined, loudness = undefined, maxTruePeak = undefined){
        super(audioContext);
        this._db = db;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dynamicCompressionState = undefined;
    }
    /**
     * Set the db value
     * @todo give range of accepted values
     * @type {number}
     */
    set db(value){
        this._db = value;
    }
    /**
     * Get the db value
     * @type {number}
     */
    get db(){
        return this._db;
    }
    /**
     * Set the loudness value
     * @todo give range of accepted values
     * @type {number}
     */
    set loudness(value){
        this._loudness = value;
    }
    /**
     * Get the loudness value
     * @type {number}
     */
    get loudness(){
        return this._loudness
    }
    /**
     * Set the MaxTruePeak value
     * @todo give range of accepted values
     * @type {number}
     */
    set maxTruePeak(value){
        this._maxTruePeak = value;
    }
    /**
     * Get the MaxTruePeak value
     * @type {number}
     */
    get maxTruePeak(){
        return this._maxTruePeak;
    }
    /**
     * Get the dynamic compression state
     * @type {number}
     */
    get dynamicCompressionState(){
        return this._dynamicCompressionState;
    }
    _process(){

    }
}
