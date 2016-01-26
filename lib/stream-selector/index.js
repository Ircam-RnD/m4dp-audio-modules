import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

export default class StreamSelector extends AbstractNode {
    /**
     * @brief This class mutes/unmutes the incoming streams according to the checkbox selections
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     */
    constructor(audioContext, audioStreamDescriptionCollection = undefined){
        super(audioContext, audioStreamDescriptionCollection);
        
        ///@todo : everything is hard-coded here ! 
        /// make it nicer

        this._splitterNode = audioContext.createChannelSplitter(10);
        
        this._mergerNode = audioContext.createChannelMerger(10);

        this._gainNode0 = audioContext.createGain();
        this._gainNode1 = audioContext.createGain();
        this._gainNode2 = audioContext.createGain();
        this._gainNode3 = audioContext.createGain();
        this._gainNode4 = audioContext.createGain();
        this._gainNode5 = audioContext.createGain();
        this._gainNode6 = audioContext.createGain();
        this._gainNode7 = audioContext.createGain();
        this._gainNode8 = audioContext.createGain();
        this._gainNode9 = audioContext.createGain();
        
        this.input.connect( this._splitterNode );
        
        this._splitterNode.connect( this._gainNode0, 0 );
        this._splitterNode.connect( this._gainNode1, 1 );
        this._splitterNode.connect( this._gainNode2, 2 );
        this._splitterNode.connect( this._gainNode3, 3 );
        this._splitterNode.connect( this._gainNode4, 4 );
        this._splitterNode.connect( this._gainNode5, 5 );
        this._splitterNode.connect( this._gainNode6, 6 );
        this._splitterNode.connect( this._gainNode7, 7 );
        this._splitterNode.connect( this._gainNode8, 8 );
        this._splitterNode.connect( this._gainNode9, 9 );

        /*
        this._gainNode0.connect( this._mergerNode, 0, 0 );
        this._gainNode1.connect( this._mergerNode, 0, 1 );
        this._gainNode2.connect( this._mergerNode, 0, 2 );
        this._gainNode3.connect( this._mergerNode, 0, 3 );
        this._gainNode4.connect( this._mergerNode, 0, 4 );
        this._gainNode5.connect( this._mergerNode, 0, 5 );
        this._gainNode6.connect( this._mergerNode, 0, 6 );
        this._gainNode7.connect( this._mergerNode, 0, 7 );
        this._gainNode8.connect( this._mergerNode, 0, 8 );
        this._gainNode9.connect( this._mergerNode, 0, 9 );
        */
        
        
        // hard downmixing to stereo L/R, for now...
        this._gainNode0.connect( this._mergerNode, 0, 0 );
        this._gainNode1.connect( this._mergerNode, 0, 1 );
        this._gainNode2.connect( this._mergerNode, 0, 1 );
        this._gainNode3.connect( this._mergerNode, 0, 2 );
        this._gainNode4.connect( this._mergerNode, 0, 1 );
        this._gainNode5.connect( this._mergerNode, 0, 2 );
        this._gainNode6.connect( this._mergerNode, 0, 1 );
        this._gainNode7.connect( this._mergerNode, 0, 2 );
        this._gainNode8.connect( this._mergerNode, 0, 1 );
        this._gainNode9.connect( this._mergerNode, 0, 2 );
        
        this._mergerNode.connect( this._output );
    }


    /**
     * Notification when the active stream(s) changes
     */
    activeStreamsChanged(){
        this._update();
    }

    
    _update(){
        /// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection.streams;

        const mainAudio         = asdc[0];
        const extendedAmbience  = asdc[1];
        const extendedComments  = asdc[2];
        const extendedDialogs   = asdc[3];

        if( mainAudio.active === true ){
            this._gainNode0.gain.value = 1;
            this._gainNode1.gain.value = 1;
        }
        else{
            this._gainNode0.gain.value = 0;
            this._gainNode1.gain.value = 0;
        }

        if( extendedAmbience.active === true ){
            this._gainNode2.gain.value = 1;
            this._gainNode3.gain.value = 1;
            this._gainNode4.gain.value = 1;
            this._gainNode5.gain.value = 1;
            this._gainNode6.gain.value = 1;
            this._gainNode7.gain.value = 1;
        }
        else{
            this._gainNode2.gain.value = 0;
            this._gainNode3.gain.value = 0;
            this._gainNode4.gain.value = 0;
            this._gainNode5.gain.value = 0;
            this._gainNode6.gain.value = 0;
            this._gainNode7.gain.value = 0;
        }

        if( extendedComments.active === true ){
            this._gainNode8.gain.value = 1;
        }
        else{
            this._gainNode8.gain.value = 0;
        }

        if( extendedDialogs.active === true ){
            this._gainNode9.gain.value = 1;
        }
        else{
            this._gainNode9.gain.value = 0;
        }
    }
}
