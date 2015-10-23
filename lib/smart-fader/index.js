import AbstractNode from '../core/index.js';


export default class SmartFader extends AbstractNode {
    /**
     * SmartFade constructor
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {number} db - db value for the SmartFader.
     * @param {number} loudness - loudness value.
     * @param {number} maxTruePeak - maxTruePeak value.
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
     */
    set db(value){
        this._db = value;
    }
    /**
     * Get the db value
     */
    get db(){
        return this._db;
    }
    /**
     * Set the loudness value
     */
    set loudness(value){
        this._loudness = value;
    }
    /**
     * Get the loudness value
     */
    get loudness(){
        return this._loudness
    }
    /**
     * Set the MaxTruePeak value
     */
    set maxTruePeak(value){
        this._maxTruePeak = value;
    }
    /**
     * Get the MaxTruePeak value
     */
    get maxTruePeak(){
        return this._maxTruePeak;
    }
    /**
     * Get the dynamic compression state
     */
    get dynamicCompressionState(){
        return this._dynamicCompressionState;
    }
    _process(){

    }
}
