/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class takes the 10 audio streams and produces a 5.1 output stream (discrete routing)
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';

export default class StreamRouting extends AbstractNode
{
    //==============================================================================
    /**
     * @brief This class takes the 10 audio streams and produces a 5.1 output stream (discrete routing)
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     *
     * @details With the WebAudioAPI specifications, the 5.1 output stream is arranged as : 
     *
     *   0: L: left
     *   1: R: right
     *   2: C: center
     *   3: LFE: subwoofer
     *   4: SL: surround left
     *   5: SR: surround right
     *
     */
    constructor(audioContext, 
                audioStreamDescriptionCollection = undefined)
    {
        super(audioContext, audioStreamDescriptionCollection);
        this._splitterNode = undefined;
        this._mergerNode = undefined;
        
        if( typeof audioStreamDescriptionCollection === "undefined" )
        {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }


        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if( totalNumberOfChannels_ != 10 ){
            console.log( "warning : total number of channels = " + totalNumberOfChannels_ );
        }

        this._splitterNode = audioContext.createChannelSplitter( totalNumberOfChannels_ );
        
        const numOutputChannels = 6;    /// 5.1

        this._mergerNode = audioContext.createChannelMerger( numOutputChannels );

        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1 
            || this._splitterNode.numberOfOutputs != totalNumberOfChannels_ )
        {
            throw new Error("Pas bon");
        }

        /// split the input streams into 10 independent channels
        this._input.connect( this._splitterNode );
        
        /// index of the destination channels, according to the WAA specifications
        const outputIndexL      = 0;
        const outputIndexR      = 1;
        const outputIndexC      = 2;
        const outputIndexLFE    = 3;
        const outputIndexLS     = 4;
        const outputIndexRS     = 5;

        /// hard-coded version
        /*
        {
            //==============================================================================
            /// main video L
            this._splitterNode.connect( this._mergerNode, 0, outputIndexL );

            /// main video R
            this._splitterNode.connect( this._mergerNode, 1, outputIndexR );

            //==============================================================================
            /// extended ambience L
            this._splitterNode.connect( this._mergerNode, 2, outputIndexL );

            /// extended ambience R
            this._splitterNode.connect( this._mergerNode, 3, outputIndexR );

            /// extended ambience C
            this._splitterNode.connect( this._mergerNode, 4, outputIndexC );

            /// extended ambience LS
            this._splitterNode.connect( this._mergerNode, 5, outputIndexLS );

            /// extended ambience RS
            this._splitterNode.connect( this._mergerNode, 6, outputIndexRS );

            /// extended ambience LFE
            this._splitterNode.connect( this._mergerNode, 7, outputIndexLFE );

            //==============================================================================
            /// extended audio comments (mono)
            this._splitterNode.connect( this._mergerNode, 8, outputIndexC );

            //==============================================================================
            /// extended audio dialogs (mono)
            this._splitterNode.connect( this._mergerNode, 9, outputIndexC );
        }
        */

        /// flexible version
        {
            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            const asdc = this._audioStreamDescriptionCollection.streams;

            /// input channel index (in the splitter node)
            var channelIndex = 0;

            /// go through all the streams 
            for( let stream of asdc )
            {

                const numChannelsForThisStream = stream.numChannels;

                for( let k = 0; k < numChannelsForThisStream; k++ )
                {

                    /// destination index (in the merger node)
                    var destinationIndex = undefined;

                    if( stream.channelIsLeft( k ) === true ){
                        destinationIndex = outputIndexL;
                    }
                    else if( stream.channelIsRight( k ) === true ){
                        destinationIndex = outputIndexR;
                    }
                    else if( stream.channelIsCenter( k ) === true ){
                        destinationIndex = outputIndexC;
                    }
                    else if( stream.channelIsLfe( k ) === true ){
                        destinationIndex = outputIndexLFE;
                    }
                    else if( stream.channelIsLeftSurround( k ) === true ){
                        destinationIndex = outputIndexLS;
                    }
                    else if( stream.channelIsRightSurround( k ) === true ){
                        destinationIndex = outputIndexRS;
                    }
                    else{
                        throw new Error("Pas bon..." );
                    }

                    this._splitterNode.connect( this._mergerNode, channelIndex, destinationIndex );

                    channelIndex++;
                }                
            }
        }

        /// connect the merger node to the output
        this._mergerNode.connect( this._output );
    }


}
