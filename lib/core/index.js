export default class AbstractNode {
    /**
     * AbstractNode constructor
     * Template for the projet audio nodes: audioContext reference, connect and disconnect methods
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor(audioContext){
        this._audioContext = audioContext;
        this.input = this._audioContext.createGain();
        this._ouput = this._audioContext.createGain();
    }
    /**
     * Connect the audio node
     */
    connect(node){
        this._ouput.connect(node)
    }
    /**
     * Disconnect the audio node
     */
    disconnect(node){
        this._ouput.disconnect(node)
    }
}
