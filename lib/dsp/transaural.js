/************************************************************************************/
/*!
 *   @file       transaural.js
 *   @brief      This class implements the transaural decoder node(s)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import SumDiffNode from './sumdiff.js'
import {getKemar2btFilters} from './kemar.js'

export default class TransauralNode extends AbstractNode {
    //==============================================================================
    /**
     * @brief This class implements a transaural decoder (abstract)
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
        this._isBypass = false; 
        this._speakersSpan = 60;     
        /// span between speaker angles
        /// e.g. 60 corresponds to speakers at azimuth +/-30 deg
        
    }

    //==============================================================================
    /**
     * Returns the span between speaker (angles in degress)
     * @type {number}
     */    
    get speakersSpan() {
        return this._speakersSpan;
    }

    //==============================================================================
    /**
     * Sets the span between speaker (angles in degress)
     * @type {number}
     */ 
    set speakersSpan( spanInDegress ){

        if( 0 < spanInDegress && spanInDegress <= 60 ){
            this._speakersSpan = spanInDegress;

            this._updateAudioGraph();
        }
        else{
            throw new Error("Invalid speakerSpan " + spanInDegress);
        }
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */
    set bypass( value ){

        if( value !== this._isBypass ){
            this._isBypass = value;      
            this._updateAudioGraph();      
        }
    }

    /**
     * Returns true if the processor is bypassed
     */
    get bypass(){
        return this._isBypass;
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        if( this.bypass === true ){
            this._input.disconnect();
            this._input.connect( this._output );
        }
        else{
            //this._updateTransauralAudioGraph();

        }
    }
}

export class TransauralShufflerNode extends TransauralNode {
    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with feedforward topology
     *        Restricted to symmetrical speakers setup
     *
     *
     * @param {AudioContext} audioContext - audioContext instance.
     *
     * @n TC : this class is OK (01/02/2016)
     */
    constructor( audioContext ){
        super( audioContext );
        this._sumDiffNode1  = undefined;
        this._convolverNode = undefined;
        this._sumDiffNode2  = undefined;
        
        /// create the nodes
        {
            this._sumDiffNode1 = new SumDiffNode( audioContext );
            this._sumDiffNode2 = new SumDiffNode( audioContext );

            this._convolverNode = audioContext.createConvolver();
            this._convolverNode.normalize = false;
        }

        /// shuffling input
        this._input.disconnect();
        this._input.connect( this._sumDiffNode1._input );

        /// filtering
        this._sumDiffNode1.connect( this._convolverNode );

        /// shuffling output
        this._convolverNode.connect( this._sumDiffNode2._input );

        /// connect to the output
        this._sumDiffNode2.connect( this._output );


        this.speakersSpan = 60;    
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        if( this.bypass === true ){
            this._input.disconnect();
            this._input.connect( this._output );
        }
        else{
            this._updateTransauralAudioGraph();
        }
    }

    _updateTransauralAudioGraph(){
        
        this._input.disconnect();

        this._input.connect( this._sumDiffNode1._input );

        /// (the rest of the graph is already connected in the constructor)

        /// updates the convolution kernels
        this._updateFilters();
    }

    _updateFilters(){

        const span = this.speakersSpan;

        var firBuffer = undefined;

        if( span <= 20 ){
            firBuffer = getKemar2btFilters( this._audioContext, 20 );
        }
        else if( span <= 40 ){
            firBuffer = getKemar2btFilters( this._audioContext, 40 );
        }
        else if( span <= 60 ){
            firBuffer = getKemar2btFilters( this._audioContext, 60 );
        }
        else{
            throw new Error("Invalid speakerSpan " + speakerSpan);
        }   

        this._convolverNode.buffer = firBuffer;
    }

}

export class TransauralFeedforwardNode extends TransauralNode {
    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with shuffler topology
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
     
        ///@todo : not yet implemented   
    }
   
}
